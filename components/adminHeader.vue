<template>
    <div class="header">
        <nuxt-link to="/">메인페이지</nuxt-link>
        <nuxt-link to="/admin/users" v-if="isAdmin">유저리스트</nuxt-link>
        <nuxt-link to="/admin/clothes" v-if="isAdmin">제품리스트</nuxt-link>
        <nuxt-link to="/admin/purchase" v-if="isAdmin">구매리스트</nuxt-link>
        <nuxt-link to="/admin/registry" v-if="isAdmin">제품등록</nuxt-link>
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
        isAdmin: 'users/isAdmin'
    }),
    async mounted () {
        let url = 'http://localhost:3000/api/v1.0/users/session-check'
        let data = await axios.get(url)
            console.log('mounted')
            console.log(data.data)
        if(data.data){
            this.isAdmin= true
        }else{
            this.isAdmin= false
        }
    }
}
</script>