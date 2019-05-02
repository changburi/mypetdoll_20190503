<template>
    <div class="container">
        <table>
            <tr><th>번호</th><th>사진</th><th>품목</th><th>제품명</th><th>단가</th><th>수량</th><th>합계 총액</th><th>취소</th><th>누적 총액</th><th>제품 상세</th></tr>            
            <tr v-for="cart in carts" :key="cart['id']">
                <td>{{cart['id']}}</td>
                <td><img width="50" height="50" :src='"http://localhost:3000/uploads/" + cart["clothe.img"]'></td>
                <td>{{cart['clothe.name']}}</td>                
                <td>{{cart['clothe.name']}}</td>
                <td>{{cart['clothe.price']}}</td>
                <td>{{cart['count']}}개</td>
                <td>{{cart['clothe.price'] * cart['count']}}원</td>
                <td><button type="button" @click="cancel(cart)">X</button></td>
                <td>{{cart['price']}}</td>
                <td>{{cart['clothe.description']}}</td>
            </tr>
        </table>
        <div class="pagination">
            <a href="#" @click='getPage(p)' v-for="p in pagination" :key="p">{{p + 1}}</a>
        </div>
        <button type="button" @click="buy(carts)">주문하기</button>
    </div>
</template>

<script>
import axios from 'axios'
import Vuew from 'vue'
import {mapMutations} from 'vuex'

let orderString = ''

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
//        alert('asyncData')
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
        async signout () {
//            alert('로그 아웃하셨습니다.')
            let url = 'http://localhost:3000/api/v1.0/users/signout'
            let data = await axios.put(url)
            this.logout()  // 상태변경
            this.$nuxt.$router.replace({ path: '/' })  // 메인페이지 이동

        },
        async cancel (cart) {
            let url = 'http://localhost:3000/api/v1.0/cart'
            let price = cart['clothe.price']
            let count = cart['count']
            let userId = cart['user.uid']
            let clothId = cart['clothe.id']
            let cartId = cart['id']
            
            price = -price
//            alert(price*count)
//            alert(cartId)
            let data = await axios.post(url, {
                cartId:cartId,
                clothId:clothId,
                price:price.toString(),
                count:count.toString()
            })

            if (data.status == 201) {
                alert('해당 제품 취소를 완료했습니다.')
//                this.asyncData()
//            this.$router.replace({ path: '/cart', force:true })  // 메인페이지 이동
            this.$router.replace({ path: '/reload', force:true })  // 메인페이지 이동                
//                reloadPage()

            } else if (data.status == 204) {
                alert('돈이부족합니다.')
            } else if (data.status == 200) {
                alert('취소하시려면 로그인을 해야합니다.')
            }
        },
        async buy (carts) {
            let url = 'http://localhost:3000/api/v1.0/purchase'
            let totalCount = carts.length
            let price = 0
            let count = 0
            let clothId = 0
            let cartId = 0
            let accuPrice = 0   
            let data = null
            let categoryName = null
            let clotheName = null
            let description = null    
            let transaction = null
            let userId = 0                
            let userName = null            
            let userNumber = null             

//            for ("cart in carts" :key="cart['id']") {
            for (var i = 0; i < totalCount; i++) {
                var cart = carts[i]
                
                for (var j in cart) {
                    if(cart.hasOwnProperty(j)) {
                        switch(j) {
                            case 'clothe.price':
                                price = cart[j]
                                break;
                            case 'count':
                                count = cart[j]
                                break;
                            case 'clothe.id':
                                clothId = cart[j]
                                break;
                            case 'id':
                                cartId = cart[j]
                                break;
                            case 'price':
                                accuPrice = cart[j]
                                break;        
                            case 'clothe.category':
                                categoryName = cart[j]
                                break;   
                            case 'clothe.name':
                                clotheName = cart[j]
                                break;    
                            case 'clothe.description':
                                description = cart[j]
                                break;   
                            case 'user.id':
                                userId = cart[j]
                                break;    
                            case 'user.uid':
                                userName = cart[j]
                                break;    
                            case 'user.password':
                                userNumber = cart[j]
                                break;                                    
                            default:
                                break;
                        }
                    }
                }
                
                
                transaction = '사용자 ID : ' + userId + ' 주문자 : ' + userName + ' 폰 번호 : ' + userNumber + 
                    ' 번호 : ' + cartId + ' 제품명 : ' + clotheName + 
                    ' 단가 : ' + price + ' 수량 : ' + count + ' 합계 총액 : ' + accuPrice +
                    ' 제품 상세 : ' + description

                orderString = orderString + transaction + '\n'                   

//                alert(orderString)
                
                data = await axios.post(url, {
                    cartId:cartId,
                    clothId:clothId,
                    price:price,
                    count:count,
                    accuPrice:accuPrice
                })
                if (data.status == 201) {
//                    alert('해당 제품을 주문 완료했습니다.')
//                    this.$nuxt.$router.replace({ path: '/' })  // 메인페이지 이동
                } else if (data.status == 204) {
                    alert('돈이부족합니다.')
                } else if (data.status == 200) {
                    alert('구매하시려면 로그인을 해야합니다.')
                    this.$nuxt.$router.replace({ path: '/signin' })  // 로그인 페이지 이동                    
                }
            }
            if (data.status == 201) {
               
                data = await axios.post(url, {
                    cartId:cartId,
                    clothId:clothId,
                    price:price,
                    count:count,
                    accuPrice:accuPrice,
                    orderString:orderString
                })
                
                if (data.status == 201) {
                    alert('해당 제품을 주문 완료했습니다.\r추가 주문이 필요하면 다시 로그인 해주세요')
                    this.signout()
                    this.$nuxt.$router.replace({ path: '/signin' })  // 로그인 페이지 이동 
                }
            }
        },        
        ...mapMutations({
            logout: 'users/logout'
        })
    }
}
</script>
