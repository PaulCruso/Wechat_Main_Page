<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<div v-html="data"></div>
	</view>
</template>

<script>
import { ref, onMounted } from 'vue';
export default {
	setup() {
		const data = ref(null);
		const fetchData = () => {
			uni.request({ // use uni-app's built-in request method to make API call
				url: 'http://localhost:8080/home',
				success: (res) => {
					// modify the innerHTML of the div element to display the data
					data.value = res.data
				}
			});
		}

		onMounted(() => {
			fetchData(); // Make API call when the component is mounted
		});

		return {
			data
		};
	}
}
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
