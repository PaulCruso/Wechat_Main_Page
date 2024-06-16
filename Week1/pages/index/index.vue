<template>
  <view>
    <view v-if="isloading">
      <view>
        <view class='header'>
          <image src='../../static/img/logo.png'></image>
        </view>
        <view class='content'>
          <view>申请获取以下权限</view>
          <text>获得你的公开信息(昵称，头像、地区等)</text>
        </view>
        <button class='bottom' type='primary' open-type="getUserInfo" withCredentials="true" lang="zh_CN"
          @getuserinfo="getuserinfo">
          授权登录
        </button>
      </view>
    </view>
    <view>
      <view class='user-info'>
        <image :src="userInfo.avatarUrl" class='avatar'></image>
        <text>{{ userInfo.nickName }}</text>
      </view>
      <view class='token-info'>
        <text>Token: {{ token }}</text>
      </view>
      <view class='code-info'>
        <text>Code: {{ code }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      SessionKey: '',
      OpenId: '',
      nickName: null,
      avatarUrl: null,
      isloading: uni.getStorageSync('isloading') || true, // 默认为 true
      userInfo: {}, // 用于存储用户信息
      token: '', // 用于存储token
      code: '' // 用于存储code
    };
  },
  methods: {
    getuserinfo(event) {
      if (event.detail.userInfo) {
        this.nickName = event.detail.userInfo.nickName;
        this.avatarUrl = event.detail.userInfo.avatarUrl;
        try {
          uni.setStorageSync('isloading', false); // 记录是否第一次授权
          this.login();
        } catch (e) {}
      }
    },
    login() {
      let that = this;
      uni.showLoading({
        title: '登录中...'
      });

      uni.login({
        provider: 'weixin',
        success: function(loginRes) {
          let code = loginRes.code;
          that.code = code; // 存储code
          if (!that.isloading) {
            that.updateUserInfo();
          }

          uni.request({
            url: `http://localhost:3000/api/login`,
            method: 'POST',
            data: {
              code: code,
              userInfo: {
                nickName: that.nickName,
                avatarUrl: that.avatarUrl
              }
            },
            header: {
              'content-type': 'application/json'
            },
            success: (res) => {
              uni.hideLoading();
              if (res.data.success) {
                uni.setStorageSync('token', res.data.token);
                that.userInfo = res.data.userInfo; // 存储用户信息
                that.token = res.data.token; // 存储token
                that.isloading = false; // 更新isloading状态
                uni.showToast({
                  title: '登录成功',
                  icon: 'success'
                });
              } else {
                uni.showToast({
                  title: '登录失败',
                  icon: 'none'
                });
              }
            }
          });
        }
      });
    },
    updateUserInfo() {
      // 如果有额外的信息需要更新到服务器，可以在这里实现
    }
  },
  onLoad() {
    this.login();
  }
}
</script>

<style>
.header {
  margin: 90rpx 0 90rpx 50rpx;
  border-bottom: 1px solid #ccc;
  text-align: center;
  width: 650rpx;
  height: 300rpx;
  line-height: 450rpx;
}

.header image {
  width: 200rpx;
  height: 200rpx;
}

.content {
  margin-left: 50rpx;
  margin-bottom: 90rpx;
}

.content text {
  display: block;
  color: #9d9d9d;
  margin-top: 40rpx;
}

.bottom {
  border-radius: 80rpx;
  margin: 70rpx 50rpx;
  font-size: 35rpx;
}

.user-info {
  text-align: center;
  margin-top: 50rpx;
}

.user-info .avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.user-info text {
  display: block;
  margin-top: 20rpx;
  font-size: 36rpx;
  color: #333;
}

.token-info {
  text-align: center;
  margin-top: 20rpx;
}

.token-info text {
  font-size: 28rpx;
  color: #666;
}

.code-info {
  text-align: center;
  margin-top: 20rpx;
}

.code-info text {
  font-size: 28rpx;
  color: #666;
}
</style>

 
