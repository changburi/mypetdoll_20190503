<template>
    <section class="container">
    <div class="detail">
            <img :src='"http://localhost:3000/uploads/"+img' align="center" width="640">    
        <ul>
            <li><h4>제품 이름 : {{name}}</h4></li>
            <li><h4>제품 가격 : {{price}} 원</h4></li>
            <li><h4>제품 상세 설명 :</h4>{{description}}</li>
            <br/>             
            <br/>             
        </ul>
    </div>
        <table class="order" width="100%" border="0" bgcolor="pink">
            <tr>
                <td>주문 하기</td>                    
                <td><h4>수량</h4></td>        
                <td><button class ="button" type="button" @click="increment(-1)"><h2>-</h2></button></td>
                <td><h4>{{n}}</h4></td>
                <td><button class ="button" type="button" @click="increment(1)"><h2>+</h2></button></td>
                <td><button class ="button" type="button" @click="buy" border="0" color="pink" ><h3>장바구니 담기</h3></button></td>     
                <td><button class ="button" type="button" @click="toCart"><h3>바로 주문하기</h3></button></td>                 
            </tr>
             <tr align="right">              
                <td colspan="7"><button class ="button" type="button" @click="toMain"><h3>목록으로 돌아가기</h3></button></td>
            </tr>
        </table>
    </section>
</template>

<style type="text/css">
    a:link {color: black; text-decoration:none;}
    a:visited {color: black; text-decoration:none;}
    a:hover {color:black; text-decoration:none;}

/*
    table {
        border-collapse: collapse;
        width: 41%;
    }
    table, th,td{
        border: 0px solid #8C8C8C;
    }
*/
/*
    th{
        background-color: #EAEAEA;
        font-size: 16px;
        font-family: Times New Roman;        
        color: black;
        padding:10px;
    }
    td{
        text-align: center;
        font-size:16px;
    }
*/

    .order {
        border:none;
        border-radius: 2px;
        border-color:pink;
        border-collapse:separate;
    }

    .button {
        border: none;
        border-radius: 2px;
        background-color:pink;
    }
    .button:hover {
        background-color:palevioletred;
        color:white;
    }
    div.detail {
        font-size: 16px;
        border: 0px solid black;
        width: 41%;
        margin: 0px;
        padding: 0px;
        background-color: pink;
        font-family: Times New Roman;
        font-style:bold;
        text-decoration: none;
    }
    

</style>

<script>
import axios from 'axios'
import {mapMutations} from 'vuex'
import {mapGetters} from 'vuex'
    
    export default {

        validate ({params}) {
            return true
        },
//        computed: mapGetters({
//            count: 'users/getCount'
//        }),
        data () {
            return {
                name:'',
                price:'',
                img:'',
                description:'',
                clothId:this.$route.params.id,
                n:0
            }
        },
        async created () {
            let url = `http://localhost:3000/api/v1.0/clothes/detail?clothId=${this.clothId}`
            let data = await axios.get(url)
            this.name= data.data.name
            this.price= data.data.price
            this.img= data.data.img
            this.description= data.data.description
        },
        methods: {
            async buy () {
                if (this.n == 0) {
                    alert('수량을 입력해주세요')
                    return 
                }
                
                let url = 'http://localhost:3000/api/v1.0/cart'
                let data = await axios.post(url, {
                    clothId: this.clothId,
                    price:this.price,
                    count:this.n,
                    description:this.description
                })
                if (data.status == 201) {
                    alert('해당 제품을 장바구니에 담았습니다.')
                    this.$nuxt.$router.replace({path:'/'})                    
                } else if (data.status == 204) {
                    alert('돈이부족합니다.')
                } else if (data.status == 200) {
                    alert('구매하시려면 로그인을 해야합니다.')
                    this.$nuxt.$router.replace({ path: '/signin' })  // 로그인 페이지 이동                       
                }
            },
            async toCart () {
                let url = 'http://localhost:3000/api/v1.0/cart'
                let data = await axios.post(url, {
                    clothId: this.clothId,
                    price:this.price,
                    count:this.n,
                    description:this.description
                })
                if (data.status == 201) {
//                    alert('주문 페이지로 이동합니다.')
                    this.$nuxt.$router.replace({path:'/cart'})                    
                } else if (data.status == 204) {
                    alert('돈이부족합니다.')
                } else if (data.status == 200) {
                    alert('구매하시려면 로그인을 해야합니다.')
                    this.$nuxt.$router.replace({ path: '/signin' })  // 로그인 페이지 이동                       
                }
            },
            async toMain () {
//                alert('주문 페이지로 이동합니다.')
                return this.$nuxt.$router.replace({path:'/'})
            },            
            async increment (value) {
                if (this.n + value >= 0) {
                    this.n += value   
                }
            }
//            ,
//            ...mapMutations({
//                increase: 'users/increase',
//                decrease: 'users/decrease'
//            })
        },
    }
</script>
