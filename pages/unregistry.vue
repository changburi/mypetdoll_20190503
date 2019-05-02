<template>
    <section class="container">
        <form @submit.prevent="registry">
            <h4>제품 등록 하기</h4>
            <label for="옷 이름">제품 이름</label>
            <input type="text" v-model="name">
            <br/>            
            <label for="옷 가격">제품 가격</label>
            <input type="text" v-model="price">
            <br/>
            <label for="옷 카테고리">제품 카테고리</label>
            <select v-model="category">
                <option v-for="cate in categories" v-bind:value="cate" :key="cate">
                    {{cate}}
                </option>
            </select>
            <br/>            
            <label for="옷 이미지">제품 이미지</label>         
            <input type="file" id="img">
            <br/>            
            <label for="제품 설명">제품 설명</label>
            <input type="text" v-model="description" min="0" max="255" maxlength="255" size="80" wrap="virtual">
<!--            <textarea name ="description" rows="7" cols="40" wrap="virtual" v-model="description">제품 설명을 입력해주세요</textarea> -->
            <button type="submit" >등록하기</button>
        </form>
        <br/>
        <table>          
            <tr v-for="cloth in clothes" :key="cloth['id']">
           
                    <nuxt-link :to='{path: "/cloth/" + cloth["id"]}'>
                        <tr align="center" valign="middle"><th>ID</th><th>사진</th><th>품명</th><th>가격</th><th>제품 설명</th><th>삭제</th></tr>
                        
                        <tr align="center" valign="middle">
                            <td>{{cloth['id']}}</td>
                            <td><img width="50" height="50" :src='"http://localhost:3000/uploads/" + cloth["img" ]'></td>
                            <td width="100">{{cloth['name']}}</td>
                            <td width="100">{{cloth['price']}}원</td>
                            <td width="450">{{cloth['description']}}</td>                        
                            <td width="50"><button type="button" @click="cancel(cloth)">X</button></td>
                        </tr>
                    </nuxt-link>    
            </tr>
        </table>
        <div class="pagination">
            <a href="#" @click='getPage(p)' v-for="p in pagination" :key="p">{{p + 1}}</a>
        </div>
    </section>
</template>

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
    layout: 'admin',
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
        let data = await axios.get('http://localhost:3000/api/v1.0/admin/clothes')
        .catch(function (error) {
            if(error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
        return {
            clothes: data.data.cloth,
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
        this.$router.replace({ path: '/admin/registry', force:true })
    },    
    methods:{
        async getPage (page) {
            let url = `http://localhost:3000/api/v1.0/admin/clothes?page=${page}`
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