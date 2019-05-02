export const state = () => ({
    isLogin:false
    ,
    isAdmin:false
    ,
    count:0
})

export const mutations = {
    login(state) {
        console.log('login success')
        console.log(state.status)
        state.isLogin= true
    },
    logout(state) {
        console.log('logout success')
        state.isLogin= false
        state.isAdmin= false
    },
    admin(state) {
        console.log('admin success')
        state.isAdmin= true
    },
    increase (state) {
        console.log('increment')
        state.count += 1
    },
    decrease (state) {
        console.log('decresement')
        if (state.count > 0) {
            state.count -= 1   
        }
    }
}

export const getters = {
    isLogin(state) {
        console.log('ocj getters')
        console.log(state.isLogin)
        return state.isLogin
    },
    isAdmin(state) {
        console.log('ocj isAdmin getters')
        console.log(state.isAdmin)
        return state.isAdmin
    },
    getCount(state) {
        console.log('ocj getCount')
        console.log(state.count)
        return state.count
    }
}