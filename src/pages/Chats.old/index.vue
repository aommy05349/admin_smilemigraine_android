<template>
    <div class="expert-chat-wrapper">
        <div class="top-bar">
            ห้องแชททั้งหมด
        </div>
        <div
            class="expert-chat-content-wrapper"
        >
            <div
                class="chat-wrapper"
                v-for="(chatRoom, index) in chatRooms"
                :key="index"
                @click="$router.push(`/chats/${chatRoom.roomId}`)"
            >
                <img
                    :src="chatRoom.memberImage ? chatRoom.memberImage : require(`@/assets/expert-chat-icon.png`)"
                    alt="chat-icon"
                >
                <div class="text-wrapper">
                    <span class="member" v-if="chatRoom.memberName" >{{ chatRoom.memberName }}</span>
                    <span class="member" v-else>หมายเลขสมาชิก1234 {{ chatRoom.memberId }}</span>
                    <div class="message">
                        <div
                            :class="`text ${chatRoom.role === 'USER' ? 'user': ''}`"
                            v-html="!chatRoom.message && chatRoom.image ? '((image))' : chatRoom.message"
                        >{{ !chatRoom.message && chatRoom.image ? '((image))' : chatRoom.message }}</div>
                        <div class="time">{{ chatRoom.time }}</div>
                    </div>
                </div>
            </div>
            <!-- <button @click="getMoreChatRooms"> More</button> -->
            <infinite-loading @infinite="getMoreChatRooms">
                <div slot="no-more" style="padding: 10px;">ไม่มีห้องแชทอื่นแล้ว</div>
            </infinite-loading>
        </div>
    </div>
</template>

<script>
import firebase, { firestore, storage } from 'firebase'
import InfiniteLoading from 'vue-infinite-loading'
import moment from 'moment'
export default {
    components: {
        InfiniteLoading
    },
    data() {
        return {
            chatRooms: [],
            total: 3,
            complete: false,
            unsubscribe: null,
        }
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
        getMoreChatRooms($state) {
            if (!this.complete) {
                if (this.unsubscribe) {
                    this.unsubscribe()
                }
                firestore().collection('chatRooms').get().then(querySnapshot => {      
                    const totalLength = querySnapshot.size
                    this.total = this.total + 3
                    this.unsubscribe = firestore().collection('chatRooms').orderBy('updated', 'desc').limit(this.total).onSnapshot(collection => {
                        const allChatRooms = []
                        const chatRooms = collection.docs.map(doc => {
                            const newChatRooms = {
                                ...doc.data(),
                                roomId: doc.ref.id
                            }
                            return newChatRooms
                        })
                        const getChatRooms = chatRooms.map(chatRoom => {
                            return firestore().collection('chatRooms').doc(chatRoom.roomId).collection('messages').orderBy('time', 'desc').limit(1).get().then(res => ({ res, chatRoom }))
                        })
                        Promise.all(getChatRooms).then(responses => {
                            responses.forEach(response => {
                                if (response.res.docs.length > 0) {
                                    allChatRooms.push({
                                        ...response.res.docs[0].data(),
                                        ...response.chatRoom,
                                        time: this.getTime(response.chatRoom.updated)
                                    })
                                }
                            })
                            if (totalLength > this.chatRooms.length) {
                                this.chatRooms = allChatRooms
                                $state.loaded()
                            }
                            else {
                                $state.complete()
                                this.complete = true
                            }
                        })
                    })
                })
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';

.expert-chat-wrapper {
    padding: 40px;
    > .top-bar {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 12px;
    }
    > .expert-chat-content-wrapper {
        > .chat-wrapper {
            padding: 8px 12px;
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

.inside-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
        flex: 1;
    }
}
</style>
