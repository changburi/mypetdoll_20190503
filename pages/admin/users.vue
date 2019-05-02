<template>
    <div class="container">
        <table>
            <tr><th>사용자</th><th>누적 총액</th><th>전화 번호</th><th>권한</th></tr>
            <tr  v-for="user in users" :key="user['id']">
                <td>{{user['uid']}}</td>
                <td>{{user['price']}}</td>
                <td>{{user['password']}}</td>                
                <td>{{user['status'] ? '일반유저': '관리자'}}</td>
            </tr>
        </table>

        <div class="pagination">
            <a href="#" @click='getPage(p)' v-for="p in pagination" :key="p">{{p + 1}}</a>
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
        let data = await axios.get('http://localhost:3000/api/v1.0/admin/users')
        .catch((error) => {
            if(error.response) {
                console.log('ocj users log');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
        });
        
            return {
                users: data.data.user,
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
            let url = `http://localhost:3000/api/v1.0/admin/users?page=${page}`
            let data = await axios.get(url)
                .catch((error) => {
                    if(error.response) {
                        console.log('ocj users methods log');
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    }
                });
                    this.users = data.data.user
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
