<template>
    <div class="header">
        <nuxt-link to="/">메인 페이지</nuxt-link>
        <nuxt-link to="/signup" v-if="!isLogin">회원가입</nuxt-link>
        <nuxt-link to="/signin" v-if="!isLogin">로그인</nuxt-link>
        <nuxt-link to="/cart" v-if="isLogin">장바구니</nuxt-link>
        <nuxt-link to="/mypage" v-if="isLogin">마이페이지</nuxt-link>
        <nuxt-link to="/admin" v-if="isAdmin">관리자페이지</nuxt-link>
    </div>
</template>

<style scoped>
    a{
        padding: 10px;
    }
</style>
<style type="text/css">
    a:link {color: black; text-decoration:none;}
    a:visited {color: black; text-decoration:none;}
    a:hover {color:black; text-decoration:bold; font-size: 20px}

    div.header {
         font-size: 16px;
/*        border: 1px solid black;*/
        
        width:40%;
        margin: 0px;
        padding: 10px;
        background-color: pink;
        font-family: Times New Roman;
        font-style:bold;
        text-decoration: none;
    }
</style>

<script>
import axios from 'axios'
import {mapGetters} from 'vuex'

export default {
    computed: mapGetters({
        isLogin: 'users/isLogin',
        isAdmin: 'users/isAdmin'
    }),
    async mounted () {
        let url = 'http://localhost:3000/api/v1.0/users/session-check'
        let data = await axios.get(url)
    
        if(data.data){
            this.isLogin= true
        }else{
            this.isLogin= false
        }
    }
}
</script>
