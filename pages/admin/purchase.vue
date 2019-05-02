<template>
    <div class="container">
        <table>
            <tr><th>ID</th><th>사용자</th><th>품명</th><th>단가</th><th>품목별 총액</th><th>수량</th><th>합계 총액</th><th>주문 날짜</th></tr>            
            <tr  v-for="purchase in purchases" :key="purchase['id']">
                <td>{{purchase['id']}}</td>
                <td>{{purchase['user.uid']}}</td>
                <td>{{purchase['clothe.name']}}</td>
                <td>{{purchase['clothe.price']}}원</td>
                <td>{{purchase['clothe.price'] * purchase['count']}}원</td>
                <td>{{purchase['count']}}</td>
                <td>{{purchase['price']}}원</td>
                <td>{{purchase['updatedAt']}}</td>
            </tr>
        </table>
        <hr>
        <div class="pagination">
            <a href="#" @click='getPage(p)' v-for="p in pagination" :key="p">{{p+1}}</a>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

function getPagination({currentPage,totalCount, limit}) {
    let pn= []
    let maxPage = Math.floor(totalCount/limit)
    
    for (let i = currentPage - 3;i < currentPage + 3 && i<=maxPage; i++) {
        if(i>-1) {
            pn.push(i)
        }
    }
    return pn
}

export default {
    layout: 'admin',
    async asyncData () {
        let data = await axios.get('http://localhost:3000/api/v1.0/admin/purchase')
        .catch((error) => {
            if(error.response) {
                console.log('ocj purchase async log');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
            return {
                purchases:data.data.purchase,
                totalCount:data.data.totalCount,
                limit:data.data.limit,
                currentPage:data.data.currentPage,
                pagination:getPagination({
                    currentPage:data.data.currentPage,
                    totalCount:data.data.totalCount,
                    limit:data.data.limit
                })
            }
    },
    methods:{
        async getPage (page) {
            let url = `http://localhost:3000/api/v1.0/admin/purchase?page=${page}`
            let data = await axios.get(url)
            .catch((error) => {
                if(error.response) {
                    console.log('ocj purchase method log');
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
            
                this.purchases = data.data.purchase
                this.totalCount = data.data.totalCount
                this.limit = data.data.limit
                this.currentPage = data.data.currentPage
                this.pagination = getPagination({
                    currentPage:data.data.currentPage,
                    totalCount:data.data.totalCount,
                    limit:data.data.limit
                })  
        }
    }
}
</script>