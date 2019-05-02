<template>
    <div class="container">
        <form @submit.prevent="signin">
            <label for="아이디">아이디</label>
            <input type="text" v-model="uid">
            <label for="패스워드">패스워드</label>
            <input type="password" v-model="password">
            <button type="submit">로그인</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex' 
export default {
    data () {
        return {
            uid:'',
            password:''
        }
    },
    methods: {
        async signin () {
            let isLogin = false
            let url = 'http://localhost:3000/api/v1.0/users/signin'
            let data = await axios.post(url, data={
                uid:this.uid,
                password:this.password
            })
            if(data.status == 200) {
                this.isLogin = true
                this.login()
                this.$nuxt.$router.replace({path:'/'})
                alert('로그인 성공')
            }
            else if (data.status == 202) {
                this.isLogin = true                
                this.login()
                this.admin()
                this.$nuxt.$router.replace({path:'/admin'})
                alert('관리자 로그인 성공')
            }
            else if (data.status == 204) {
                alert('잘못된 정보입니다.')
            }
            
            let cartUrl = 'http://localhost:3000/api/v1.0/cart'
            if (this.isLogin) {
                let data = await axios.post(cartUrl, data={
                    isLogin:1
                }).catch(function (error) {
                    if(error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
            }
        },
        ...mapMutations({
            login:'users/login',
            admin:'users/admin'
        })
    }
}
</script>

