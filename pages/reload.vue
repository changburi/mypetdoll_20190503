<template>
    <div class="container">
        <nuxt ref="page"/>
        <button type="button" @click="signout">로그아웃</button>
        <table>
            <tr v-for="cart in carts" :key="cart['id']">
                <td>{{cart['id']}}</td>
                <td>{{cart['user.uid']}}</td>
                <td>{{cart['clothe.name']}}</td>
                <td>{{cart['clothe.price']}}원</td>
                <td>{{cart['count']}}개</td>
                <td>총 {{cart['clothe.price'] * cart['count']}}원</td>
                <td><button type="button" @click="cancel(cart)">X</button></td>
                <td>주문내역 총액 {{cart['price']}}원</td>
                <td>{{cart['description']}}</td>
            </tr>          
        </table>
        <div class="pagination">
            <a href="#" @click='getPage(p)' v-for="p in pagination" :key="p">{{p + 1}}</a>
        </div>
        <hr>
        <button type="button" @click="buy(carts)">주문하기</button>
    </div>
</template>

<script>
import axios from 'axios'
import Vuew from 'vue'
import {mapMutations} from 'vuex'
function getPagination ({currentPage, totalCount, limit}) {
    let pn = []
    let maxPage = Math.floor(totalCount/limit)
    for(let i = currentPage -3; i < currentPage +3 && i <= maxPage ; i++){
        if(i> -1){
            pn.push(i)
        }
    }
    return pn
}

export default {
    async asyncData () {
        let data = await axios.get('http://localhost:3000/api/v1.0/cart')

        return {
            carts: data.data.cart,
            totalCount: data.data.totalCount,
            limit : data.data.limit,
            currentPage: data.data.currentPage,
            pagination: getPagination({
                currentPage: data.data.currentPage ,
                totalCount: data.data.totalCount,
                limit : data.data.limit
            })
        }
    },
    mounted: function() {
//        alert('mounted')
            this.$router.replace({ path: '/cart', force:true })
    },

    methods : {
        async getPage (page) {
            let url = `http://localhost:3000/api/v1.0/cart?page=${page}`
            let data = await axios.get(url)
            this.carts = data.data.cart
            this.totalCount = data.data.totalCount
            this.limit = data.data.limit
            this.currentPage = data.data.currentPage
            this.pagination = getPagination({
                currentPage: data.data.currentPage,
                totalCount: data.data.totalCount,
                limit : data.data.limit
            })          
        },
        ...mapMutations({
            logout: 'users/logout'
        })
    }
}
</script>
