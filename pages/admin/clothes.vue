<template>
    <div class="container">
        <table>
            <tr><th>ID</th><th>이미지</th><th>품목</th><th>제품명</th><th>가격</th><th>제품 설명</th></tr>
            <tr  v-for="cloth in clothes" :key="cloth['id']">
                <td>{{cloth['id']}}</td>                
                <td><img width="50" height="50" :src='"http://localhost:3000/uploads/" + cloth["img" ]'></td>                
                <td>{{cloth['category']}}</td>
                <td>{{cloth['name']}}</td>
                <td>{{cloth['price']}}</td>
                <td>{{cloth['description']}}</td>                
            </tr>
        </table>
        <div class="pagination">
            <a href="#" @click='getPage(p)' v-for="p in pagination" :key="p">{{p + 1}}</a>
        </div>
    </div>
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
    methods : {
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
