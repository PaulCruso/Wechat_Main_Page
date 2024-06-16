const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// 微信小程序的AppID和AppSecret
const appId = 'wx1b08049435ffe1ba';
const appSecret = 'e0b5e53b696aa86d3cfd0b65dfb9c6c4';
// JWT secret key
const jwtSecretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxODUwNTY3MywiaWF0IjoxNzE4NTA1NjczfQ.XpY7CIp6_f0ZYWFkbsYjRSrSj1Zyf9diLHb9EBeqrJQ';

app.post('/api/login', async (req, res) => {
  const { code, userInfo } = req.body;
  try {
    const response = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`);
    const { openid, session_key } = response.data;

    // 生成JWT token
    const token = jwt.sign(
      {
        openid,
        session_key,
        userInfo
      },
      jwtSecretKey,
      {
        expiresIn: '2h' // Token有效期为2小时
      }
    );

    // 保存用户信息到数据库（略）

    res.json({ success: true, token, userInfo });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});