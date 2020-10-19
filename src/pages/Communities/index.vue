<template>
    <div class="expert-community-wrapper">
    
        <div class="top-wrapper">
            <div class="header">Community ทั้งหมด</div>
            <div class="search-wrapper">
                <button type="submit"  @click="getPostPage()">เพิ่มโพสต์ในคอมมูนิตี้</button>
            </div>
        </div>
        <div class="row">
            <!-- {{posts}} -->
            <div class="column">
                <table id="myTable">
                    <thead>
                        <tr >
                            <th style="width:15.8333‬%" >No.</th>
                            <th style="width:15.8333‬%"></th>
                            <th style="width:15.8333‬%">Content</th>
                            <th style="width:15.8333‬%">Like</th>
                            <th style="width:15.8333‬%">Comment</th>
                            <th style="width:15.8333‬%">ระยะเวลาที่โพสต์</th>
                            <th style="width:5‬%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(post,index) in posts" v-bind:key="post.id">
                            <td style="text-align: center;">{{ doMath(index) }} </td>
                            <td style="text-align: left;" >
                                <img  :src="post.post_image  ? post.post_image['value'] : require(`@/assets/logo.png`)" style="border-radius: 5px;" width="60px"  >
                                <!-- <img  src='https://firebasestorage.googleapis.com/v0/b/sm-com.appspot.c…oGi8UGM?alt=media&token=204677d8-e639-441b-86cc-2eedddc887f3' style='border-radius: 5px;' width='60px'  > -->
                                <!-- <img  :src='post.post_image  ? post.post_image["i"] : require("@/assets/logo.png")' style='border-radius: 5px;' width='60px'  > -->
                            </td>
                            <td style="text-align: left;"  v-if="post.content_length > 64">                          
                                {{post.post_content.substring(0,65)+"..." }}
                            </td>
                            <td style="text-align: left;"  v-if="post.content_length < 64">{{post.post_content }}+ </td>
                            <td class="button-like-comment-td" style="text-align: center;">{{post.likes}}</td>
                            <td class="button-like-comment-td" style="text-align: center;" > {{post.comments}} </td>
                            <td class="button-timming-td" style="text-align: center;"> {{post.post_at}} </td>
                            <td class="button-td" style="text-align: center;">
                                <button   @click="$router.push(`/detailcommunity/${post.id}`)"  class="warning-community" >
                                    แก้ไข
                                </button> 
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    
</template>

<script>
import firebase, { firestore, storage } from 'firebase'
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
import { mapState } from 'vuex'
import getUnique from '@/helpers/getUnique'

export default {
     components: {
        InfiniteLoading
    },
    data() {
        return {
            //   totalPage: 1,
            complete: false,
            unsubscribe: null,
            content_length: null,
            startAt: null,
            totalPage: 1,
            loadingCommunityRooms: false,
            posts : [],
            allcomment: [],
            allLike: [],
            count : null
        }
    }, 
    mounted() {
        this.getPostCommunity() 
    },
    computed: {
    },
    methods: {
        moment,
        getTotalTimeMedicine(time) {
            return moment(time.post_at, 'YYYY-MM-DD HH:mm:ss').fromNow()
        },
        getPostPage() {
            this.$router.push('/postcommunitys')
        },
        getTime(data) {
            var postTime = moment(data* 1000);
            const currentTime = moment()
            if (currentTime.diff(postTime, 'day') >= 7) {
                return postTime.format('D MMM HH:mm')
            }
            if (currentTime.diff(postTime, 'hour') >= 24) {
                return postTime.format('dddd HH:mm')
            }
            return `${postTime.format('HH:mm')} น.`
        },
        doMath: function (index) {
            return index+1
        },
        details (board) {
            router.push({ name: 'detailcommunity', params: { id: board }})
        },
        getPathImage(pathImage){
            // return  firebase.storage().ref(pathImage).getDownloadURL().then(function(url) {
            //     console.log(url); 
            //     return url
            // }
            return  firebase.storage().ref(pathImage).getDownloadURL().then(url => {
               console.log(url)
            return url;
        }
        )
        },
        getPostCommunity() {
            this.loadingCommunityRooms = true
                setTimeout(() => {
                   const listener = firestore().collection('posts').onSnapshot(querySnapshot => {
                        firestore().collection('posts').orderBy('post_at', 'desc').get().then(collection => {
                            this.startAt = collection.docs[collection.docs.length - 1]
                            const allPosts = []
                            const posts = collection.docs.map(doc => {
                            // console.log(doc.data().post_image)
                                const data ={
                                    'id' : doc.id,
                                    'post_at': this.getTime(doc.data().post_at) ,
                                    'post_content': doc.data().post_content,
                                    'post_image': this.getPathImage(doc.data().post_image),
                                    'post_id': doc.data().post_id,
                                    'update_user': doc.data().update_user,
                                    'content_length': doc.data().post_content.length,
                                    'comments': doc.data().all_comments,
                                    'likes': doc.data().all_likes
                                }
                                console.log(data)
                                this.posts.push(data)
                            })
                         
                        })
                    })
                }, 100)
        },
        changePage(page) {
        },
        getComment(id){
            firestore().collection('comments').where('post_id', '==', id).get().then(collection => {
                const count = collection.docs.length 
                this.allcomment.push(count)
            })
 
        },
        getLike(id){
            firestore().collection('likePosts').where('post_id', '==', id).get().then(collection => {
                const postLike = collection.docs.length 
                this.allLike.push(postLike)
           
            })
 
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';

.expert-community-wrapper {
    padding: 40px;
    > .top-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > .header {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 12px;
        }
        > .search-wrapper {
            display: flex;
            margin: 10px 0;
            > input {
                border: 1px solid $main-color;
                outline: none;
                padding: 0 12px;
                height: 32px;
            }

            > select {
                border: 1px solid $main-color;
                outline: none;
                font-size: 1.2em;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                border-right: 0;
                height: 32px;
            }

            > button {
                border: 1px solid $main-color;
                height: 32px;
                background: $main-color;
                color: $text-white-color;
                padding: 0 12px;
                border-radius: 10px;
                // border-radius: 10px;
            }
        }
    }
    #myTable {
        width: 100%; /* Full-width */
        border: 1px solid white; /* Add a grey border */
        font-size: 18px; /* Increase font-size */
        border-spacing: 16px 0;
        }

    #myTable th, #myTable td {
        font-size: 16px;
        border: 1px solid #ffffff;
        font-weight: normal;
        // padding: 8px 2px 2px 8px;
        border-bottom: 1px solid #aaaaaa;
        cursor: pointer;
        white-space: nowrap;
        
        }

    #myTable tr {
        border-bottom: 1px solid white;
        }
    #myTable .button-td {
            width: 7%;
        }
    #myTable .button-like-comment-td {
            width: 10%;
        }
    #myTable .button-timming-td {
            width: 10%;
        }

    #myTable tr.header, #myTable tr:hover {
        background-color: white;
        }
  
    > .top-bar {
        top: 0;
        left: 0;
        right: 0;
        height: 48px;
        justify-content: center;
        align-items: center;
        position: fixed;
        background: $main-color;
        color: #ffffff;
        display: none;
         @include respond-to ($mobile) {
            & {
                display: flex;
            }
        }
    }
    > .expert-community-content-wrapper {
        display: flex;
        flex-direction: column;
        > .community-wrapper {
            cursor: pointer;
            > div {
                padding: 8px 0;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #eeeeee;
                > img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                > .text-wrapper {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;
                    overflow: hidden;
                    padding-left: 8px;
                    > .member {
                        font-size: 14px;
                        color: #181818;
                        font-weight: bold;
                    }
                    > .message {
                        font-size: 14px;
                        display: flex;
                        justify-content: space-between;
                        overflow: hidden;
                        > .text {
                            color: #999999;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            height: 20px;
                        }
                        > .time {
                            white-space: nowrap;
                            padding-left: 2px;
                            padding-right: 32px;
                        }
                    }
                    .user {
                        font-weight: bold;
                        color: $main-color !important;
                    }
                }
            }
        }
    }
    >#column {
        float: left;
        width: 50%;
        padding: 10px;
        height: 50+-px; 
    }

     #row:after {
        content: "";
        display: table;
        clear: both;
        }
}

    .load-more-community {
        margin: 12px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $main-color;
        border-radius: 20px;
        color: $main-color;
        outline: none;
    }
    .warning-community {
        background-color: white;
        margin: 0px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $warning-color;
        border-radius: 20px;
        color: $warning-color;
        outline: none;
    }
    .danger-community {
        background-color: white;
        margin: 0px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $danger-color;
        border-radius: 20px;
        color: $danger-color;
        outline: none;
    }
    .pagination {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        list-style-type: none;
        border-radius: 8px;
        margin: 16px 0;
    }  
    .pagination-page {
        margin: 0 8px;
        border: 2px solid #6c6c6c;
        border-radius: 4px;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #6c6c6c;
    }  
    .prev-page {
        padding: 8px 12px;
        color: #6c6c6c;
    }
    .next-page {
        padding: 8px 12px;
        color: #6c6c6c;
    }
    .active-page {
        background: $main-color;
        color: $text-white-color;
        border: 2px solid $main-color;
    }
    
</style>
