<template>
    <div class="expert-chat-wrapper">
        <div
            class="expert-chat-content-wrapper"
        >
            <p class="header">ห้องแชททั้งหมด</p>
            <div
                class="chat-wrapper"
                v-for="(chatRoom, index) in chatRooms"
                :key="index"
                @click="$router.push(`/chats/${chatRoom.roomId}`)"
            >
                <div
                    v-if="!chatRoom.lastMessage.isNewChat"
                >
                    <img
                        :src="chatRoom.memberImage ? chatRoom.memberImage : require(`@/assets/expert-chat-icon.png`)"
                        alt="chat-icon"
                    >
                    <div class="text-wrapper">
                        <span class="member" v-if="chatRoom.memberName" >{{ chatRoom.memberName }}</span>
                        <span class="member" v-else>หมายเลขสมาชิก {{ chatRoom.memberId }}</span>
                        <div class="message">
                            <div :class="`text ${chatRoom.lastMessage.role === 'USER' ? 'user': ''}`"  v-html="!chatRoom.lastMessage.message && chatRoom.lastMessage.image ? '((image))' : chatRoom.lastMessage.message" >{{ !chatRoom.lastMessage.message && chatRoom.lastMessage.image ? '((image))' : chatRoom.lastMessage.message }}</div>
            
                                <div class="time"> {{chatRoom.member_iamge}} {{ chatRoom.time }}</div>
                            </div>
                        </div>
                    </div>

            </div>
            <button
                class="load-more-massages"
                :disabled="loadingChatRooms"
                @click="getMoreMessageRooms"
            >
                {{ loadingChatRooms ? 'กำลังโหลด' : 'ดูข้อความก่อนหน้า' }}
            </button>
        </div>
    </div>
</template>

<script>
import firebase, { firestore, storage } from 'firebase'
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
import { mapState } from 'vuex'
import memberAPI from '@/api/member'
import getUnique from '@/helpers/getUnique'

export default {
    components: {
        InfiniteLoading
    },
    data() {
        return {
            complete: false,
            unsubscribe: null,
            startAt: null,
            loadingChatRooms: false,
            member_iamge:null
        }
    },
    computed: {
        ...mapState({
            chatRooms: state => state.chatRooms.data,
            chatRoomsListener: state => state.chatRooms.listener,
        })
    },
    mounted() {
        this.getChatRooms()
    },
    methods: {
        getTime(time) {
            const chatTime = moment(time * 1000)
            const currentTime = moment()
            if (currentTime.diff(chatTime, 'day') >= 7) {
                return chatTime.format('D MMM HH:mm')
            }
            if (currentTime.diff(chatTime, 'hour') >= 24) {
                return chatTime.format('dddd HH:mm')
            }
            return `${chatTime.format('HH:mm')} น.`
        },
        getChatRooms() {
            this.loadingChatRooms = true
            setTimeout(() => {
                if (!this.chatRoomsListener) {
                    const listener = firestore().collection('chatRooms').onSnapshot(querySnapshot => {
                        firestore().collection('chatRooms').orderBy('updated', 'desc').limit(15).get().then(collection => {
                            this.startAt = collection.docs[collection.docs.length - 1]
                            const allChatRooms = []
                            const chatRooms = collection.docs.map(doc => {
                                const newChatRooms = {
                                    ...doc.data(),
                                    roomId: doc.ref.id,
                                    member_iamge : this.getImageMember(doc.data().memberId),
                                    lastMessage: doc.data().lastMessage ? doc.data().lastMessage : {},
                                    time: this.getTime(doc.data().updated)
                                }
                                if (!doc.data().lastMessage) {
                                    const id = doc.ref.id
                                    firestore().collection("chatRooms").doc(id).collection('messages').orderBy('time', 'desc').limit(1).get().then(doc => {
                                        firestore().collection("chatRooms").doc(id).update({
                                            updated: doc.docs[0].data().time,
                                            lastMessage: doc.docs[0].data()
                                        })
                                    })
                                }
                                return newChatRooms
                            })
                            this.loadingChatRooms = false
                            this.$store.commit('chatRooms/setchatRooms', chatRooms)
                        })
                    })
                    this.$store.commit('chatRooms/setListener', listener)
                }
                else {
                    this.loadingChatRooms = false
                }
            }, 100)
        },
        getImageMember(mb_id){
            memberAPI.getMemberById(mb_id).then(response => {
                if(responses[0][0]['profile_img'] === null){
                    member_iamge = "https://storage.googleapis.com/download/storage/v1/b/cloud-storage-bucket-sm/o/uploads%2F5f4a95ed49b40.jpeg?generation=1598723565450626&alt=media" ;
                }else{
                    member_iamge = responses[0][0]['profile_img']
                }
                return member_iamge
            })
        },
        getMoreMessageRooms() {
            this.loadingChatRooms = true
            setTimeout(() => {
                if (this.chatRoomsListener) {
                this.chatRoomsListener()
                const chatRoomsLength = this.chatRooms.length + 15
                const listener = firestore().collection('chatRooms').onSnapshot(querySnapshot => {
                    firestore().collection('chatRooms').orderBy('updated', 'desc').limit(chatRoomsLength).get().then(collection => {
                        this.startAt = collection.docs[collection.docs.length - 1]
                        const allChatRooms = []
                        const chatRooms = collection.docs.map(doc => {
                            const newChatRooms = {
                                ...doc.data(),
                                roomId: doc.ref.id,
                                lastMessage: doc.data().lastMessage ? doc.data().lastMessage : {},
                                time: this.getTime(doc.data().updated)
                            }
                            if (!doc.data().lastMessage) {
                                const id = doc.ref.id
                                firestore().collection("chatRooms").doc(id).collection('messages').orderBy('time', 'desc').limit(1).get().then(doc => {
                                    firestore().collection("chatRooms").doc(id).update({
                                        updated: doc.docs[0].data().time,
                                        lastMessage: doc.docs[0].data()
                                    })
                                })
                            }
                            return newChatRooms
                        })
                        this.loadingChatRooms = false
                        this.$store.commit('chatRooms/setchatRooms', chatRooms)
                    })
                })
                this.$store.commit('chatRooms/setListener', listener)
            }
            }, 100)
        }
    },
}
</script>
<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';

.expert-chat-wrapper {
    padding: 40px;
    .header {
        font-size: 36px;
        font-weight: bold;
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
    > .expert-chat-content-wrapper {
        display: flex;
        flex-direction: column;
        > .chat-wrapper {
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
}

.load-more-massages {
    margin: 12px 0;
    align-self: center;
    padding: 4px 8px;
    border: 2px solid $main-color;
    border-radius: 20px;
    color: $main-color;
    outline: none;
}
</style>
