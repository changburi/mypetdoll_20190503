<template>
    <section class="container">
        <div class="category">
            <input type="radio" id='양모' name="양모" value="양모" checked="checked" a href="#" @click="changeCategory('양모')"/>양모
<!--                <a href="#" @click="changeCategory('top')">양모</a>-->
            <input type="radio" id='액세서리' name="액세서리" value="액세서리" a href="#" @click="changeCategory('액세서리')"/>액세서리
        </div>
        <div class="pagination">
            <a href="#" @click='getPage(p)' v-for="p in pagination" :key="p">{{p + 1}}</a>
        </div>
        <div class="product_list">
                <table>
                        <tr v-for="cloth in clothes" :key="cloth['id']">
                            <nuxt-link :to='{path: "/cloth/" + cloth["id"]}'>
                                <tr align="center" valign="middle"><th>이미지</th><th>제품명</th><th>제품 가격</th><th>제품 설명</th></tr>                                
                                <tr align="center" valign="middle">                    
                                    <td><img width="200" height="200" :src='"http://localhost:3000/uploads/" + cloth["img" ]'></td>
                                    <td width="100">{{cloth['name']}}</td>
                                    <td width="100">{{cloth['price']}}</td>
                                    <td width="400">{{cloth['description']}}</td>
                                </tr>
                            </nuxt-link>
                        </tr>
                </table>   
            </div>
    </section>
</template>

<style type="text/css">
    a:link {color: black; text-decoration:none;}
    a:visited {color: black; text-decoration:none;}
    a:hover {color:black; text-decoration:none; font-size:18px;}
        
    table {
        border-collapse: collapse;
        width: 41%;
    }
    table, th,td{
        border: 1px solid #8C8C8C;
    }
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

    div.category {
        font-size: 16px;
/*        border: 1px solid black;*/
        width:70%;
        height:20%;
        margin: 0px;
        padding: 10px;
/*        background-color: pink;*/
        font-family: Times New Roman;
        font-style:bold;
        text-decoration: none;
    }

</style>

<script>
import axios from 'axios'
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
        data () {
        return {
            categories: ['양모', '액세서리'],
            clothId:'',
            name:'',
            price:'',
            category:'',
            register:'',
            description:''
            }
        },    
        async asyncData () {
            let data = await axios.get('http://localhost:3000/api/v1.0/clothes')
            .catch((error) => {
                if(error.response) {
                    console.log('ocj error index async log');
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);                        
                }                    
            });
            return {
                clothes: data.data.cloth,
                totalCount: data.data.totalCount,
                limit: data.data.limit,
                currentPage:data.data.currentPage,
                pagaination:getPagination({
                    currentPage:data.data.currentPage,
                    totalCount:data.data.totalCount,
                    limit:data.data.limit
                }),
                category: ''
            }
        },
    mounted: function() {
        this.changeCategory('양모')
    },
    methods : {
        changeCategory (category) {
            this.category = category
            this.getPage(0)
            
            var first=document.querySelector('#양모');              
            var second=document.querySelector('#액세서리');          

            if (this.category=='양모') {
                first.checked=true;
                second.checked=false;
            } else if (this.cateogry='액세서리'){
                first.checked=false;
                second.checked=true;
            }
        },
        async getPage (page) {
            let url = `http://localhost:3000/api/v1.0/clothes?page=${page}&category=${this.category}`
            let data = await axios.get(url)
            this.clothes = data.data.cloth
            this.totalCount = data.data.totalCount
            this.limit = data.data.limit
            this.currentPage = data.data.currentPage
            this.pagination = getPagination({
                currentPage: data.data.currentPage,
                totalCount: data.data.totalCount,
                limit : data.data.limit
            })
        }
    }
}
</script>