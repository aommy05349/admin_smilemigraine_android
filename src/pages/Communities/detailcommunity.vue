
<template>

 <div class="expert-community-wrapper" style="background-color:#e6e6e6">
<p class="header">แก้ไขโพสต์ในคอมมูนิตี้</p> 
        <div class="row" >
            <br>
            <div class="column-4" style="background-color:#fff; text-align: center;border-radius: 10px;;margin-right: 12px;" >
                <!-- <br> {{imageUrl}} -->
                <img   v-if ="imageUrl == '' && imageUrlFire == ''" width="100%" src="@/assets/logo.png" alt="sm-logo"  style="border-radius: 5px;">
                <img   :src="imageUrlFire['i']"  width="100%" v-if="imageUrlFire && imageUrl == ''" style="border-radius: 5px;">
                <img   :src="imageUrl"  width="100%" v-if="imageUrl" style="border-radius: 5px;">
                 <label for="file-upload" class="custom-file-upload">
                   choose image 
                </label>
                <input  type="file" ref="image"  id="file-upload" accept="image/*" @change="onFilePicked">
                <div class="row">
                    <div class="row">
                        <div v-if ="unlike_post" class="column-1" style="padding-top: 25px;">
                            <img   style="width: 60%;" src="@/assets/vote-2.png" @click="addLikePost(postID,posts.all_likes)">
                        </div>
                        <div v-if ="like_post"  class="column-1" style="padding-top: 20px;">
                            <img  style="width: 95%;" src="@/assets/vote.png"  >
                        </div>
                        <div class="column-1" style="padding-top: 11px;width: 6px;">
                            <label for="vote"> &nbsp;&nbsp; {{alllike_post}} </label>
                        </div>
                        <div class="column-6" style="margin-right: 60px;"></div>
                    </div>
                    <div class="row"  v-if="isHidden">
                    <section class="example">
                        <div class="mx-auto">
                            <div class="sub-heading x-pad">
                            </div>
                            <div class="x-pad">
                            <share-it
                                :text="{post_content}"
                                url=""
                                :height="600"
                                :width="600"
                            />
                            </div>
                        </div>
                    </section>
                    </div>
                </div>
                <div class="comments">
                    <div class="commenting" v-for="(comment,index)  in comments" v-bind:key="comment.id" style="margin-top: 2px;">
                         <td style="text-align: center;display: none;"  >{{ doMath(index) }}</td>
                         <!-- <tr v-for="(post,index) in posts" v-bind:key="post.id"> -->
                        <div class="row"  style="margin: 10px90;text-align: left;background-color: #f2f2f2;border-radius: 5px;">
                            <label for="vote" style="font-size: small;"  v-if="comment.role == 'EXPERT'"> &nbsp;&nbsp; Smile Migrain . {{comment.comment_at}} </label>
                            <label for="vote" style="font-size: small;"  v-if="comment.role == 'USER'"> &nbsp;&nbsp;  {{comment.member_name}} . {{comment.comment_at}} </label>
                            <div class="row">
                                <div class="column-8" style="margin-right: 20px;width: 76%;">
                                    <textarea disabled="disabled" name="" id="" cols="70" rows="3" v-model="comment.comment" style="padding-left: 25px;width: 100%; border: none;background-color:rgb(242, 242, 242); "></textarea>
                                </div>      
                                <div v-if ="allLikecomment[index] ==0" class="column-1" style="padding-top: 0px;text-align: end;margin-right: 10px;padding-top: 7px;" >
                                        <img  style="width: 60%;" src="@/assets/vote-2.png"   @click="addLikeComment(comment.id,comment.alllike_incomment,index)" >
                                </div>
                                <div  v-if ="allLikecomment[index] !=0" class="column-1" style="padding-top: 0px;text-align: end;margin-left: 10px;">
                                        <img style="width: 95%;" src="@/assets/vote.png"   >
                                </div>
                                <div class="column-1" style="padding-top: 17px;">
                                    <label for="vote"> {{ comment.alllike_incomment }}</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="comments">
                    <div class="row"  style="margin: 10px;text-align: left;background-color: #f2f2f2;border-radius: 5px;">
                        <label  style="font-size: inherit;"> &nbsp;&nbsp; แสดงความคิดเห็น </label>
                       <div class="row">
                           <div class="column-8">
                                <input type="text" style="width: 100%;" v-model="post_comment" class="form-control" placeholder="แสดงความคิดเห็น" >
                           </div>
                           <div class="column-2" style="padding-top: 26px;">
                                <img  src="@/assets/send.png"   @click="sendComment()">
                           </div>
                       </div>
                    </div>
                </div>
            </div>
            <div class="column-4" style="background-color:#fff;border-radius: 10px;">
                <div class="row"  style="text-align: center;" >
                    <p style="text-align: left ;" >content :</p>  
                    <textarea name="post_content" id="post_content" cols="40" rows="12" v-model="posts.post_content"  style="padding: 25px;" class="form-control" ></textarea>
                    <label for="post_content"></label>
                    <div class="row" style="text-align: center ;">
                        <div class="column">
                            <button @click="updatePost" class="btn-post">อัพเดตโพสต์</button>
                        </div>
                        <div class="column">
                            <button @click="deletPost(posts.id)" class="danger-post">ลบโพสต์</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  <!-- </div> -->
 </div>
</template>

<script>
import firebase, { firestore, storage } from 'firebase'
import { mapState } from 'vuex'
import Vue from 'vue'
import moment from 'moment'
import ImageModal from './components/ImageModal'
import SocialSharing   from "vue-social-sharing"
export default {
  props: [ 'message','meta', 'metaInfo'],
  name: "app",
//   name: 'posts',
  components: {
     SocialSharing
    //  meta
  },
  data () {
    return {
        logo:  require('@/assets/logo.png'),
        post_content: "",
        post_comment : "",
        imageName : "",
        imageFile : "",
        imageUrl : '' ,     
        loadingCommunityRooms: false,
        posts: {},
        comments: [],
        create_user : "",
        post_at : "",
        imageData: null,
        total_like : 0,
        isHidden: false,
        unlike_comment: true,
        like_comment: false,
        unlike_post: true,
        like_post: false,
        url:"https://www.facebook.com/SmileMigraine/",
        // countLikePost : 0,
        countLikeComment : [],
        allLikecomment : [],
        Likecomment : [],
        imagePath: null,
        imageUrlFire : '' ,    

        alllike_post:0,
        all_comment:0,
    }
  },
  mounted() {
    this.getComments() 
    window.addEventListener("hashchange", () => {
      window.scrollTo(window.scrollX, window.scrollY - 100);
    });
    this.checkLikePost()
    this.checkAllLikePost()
  },
  beforeDestroy() {
    window.removeEventListener("hashchange");
  },
  computed: {
    ...mapState({
        expert: state => state.user.data
    }),
     pageURL() {
      return window.location.href;
    }
  },
  beforeMount() {
    this.postID = this.$route.params.postID;
   },
  created() {
       const ref = firebase.firestore().collection('posts').doc(this.$route.params.postID);
       ref.get().then((doc) => {
           if (doc.exists) {
             this.posts = doc.data();
             this.alllike_post = doc.data().all_likes;
             this.all_comment = doc.data().all_comments;
             this.imagePath = this.posts.post_image;
             this.post_at = this.posts.post_at;
             this.imageUrlFire = this.getPathImage(this.posts.post_image);

           } else {
             alert("No such document!");
           }
       });

  },
  methods: {
    moment,
    doMath: function (index) {
        return index
    },
    makeId(length) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    },
    updatePost(){
       
       if(this.post_content != null){
            if(this.imageUrl){
                firebase.storage().ref(`postImages/${this.makeId(10)}`).put(this.imageData).then(response => {
                    const time = moment().unix()
                     firebase.firestore().collection('posts').doc(this.$route.params.postID).update({
                        post_content: this.posts.post_content ,
                        post_image: response.metadata.fullPath ,
                        update_user :this.expert.member_id 
                    });
                })
            }else{
                firebase.firestore().collection('posts').doc(this.$route.params.postID).update({
                    post_content: this.posts.post_content ,
                    post_image: this.imagePath ,
                    update_user :this.expert.member_id 
                });
            }
            const time = moment().unix()



        }else if(this.imageData == null){
           alert('pls fill your img content');
        }else{
           alert('pls fill your content');
        }
       
      },
    deletPost(id){
          firebase.firestore().collection('posts').doc(this.$route.params.postID).delete()
          .then(() => {
              this.$router.push('/communities')
          })
          .catch((error) => {
              alert("Error removing document: ", error);
          });
      },
    onFilePicked(e) {
            const files = e.target.files;
            this.imageData = e.target.files[0];
            if (files[0] !== undefined) {
                this.imageName = files[0].name;
                if (this.imageName.lastIndexOf(".") <= 0) {
                    return;
                }
                const fr = new FileReader();
                fr.readAsDataURL(files[0]);
                fr.addEventListener("load", () => {
                    this.imageUrl = fr.result;
                    this.imageFile = files[0]; 
                });
            } else {
                this.imageName = "";
                this.imageFile = "";
                this.imageUrl = '';
            }
    },
    getPathImage(pathImage){
        return  firebase.storage().ref(pathImage).getDownloadURL().then(url => {
            return url;
        })
    },
    sendComment(){
        firebase.firestore().collection('posts').doc(this.$route.params.postID).update({
            all_comments: this.all_comment+1
        });
        const post_id = this.$route.params.postID;
        const time = moment().unix()
        const member_id = this.expert.member_id;
        if(this.post_comment != ""){
           const query =   firestore().collection('comments').add({
                post_id: post_id ,
                member_id:member_id,
                role:'EXPERT',
                alllike_comments:0,
                comment:this.post_comment,
                comment_at:time,
            })
            .then(function(docRef){
            })
            .catch(function(error){
            });
                this.post_comment = "";
            
        }
    },
    gotData(data){
    },
    getComments() {
        const listener = firestore().collection('comments').onSnapshot(querySnapshot => {
            firestore().collection('comments').where('post_id', '==', this.$route.params.postID).orderBy('comment_at','desc').limit(5).get().then(collection => {
            this.comments = [];
              
                const comment = collection.docs.map(doc => {
                    const data ={
                        'id' : doc.id,
                        'comment_at': this.getTime(doc.data().comment_at) ,
                        'comment': doc.data().comment,
                        'member_id': doc.data().member_id,
                        'post_id': doc.data().post_id,
                        'role': doc.data().role,
                        'member_name': doc.data().user_name,
                        'like_comment': this.checkUserLikeComment(doc.id),
                        'alllike_comment': this.checkAllLikeComment(doc.id),
                        'alllike_incomment':doc.data().alllike_comments
                    }
                    this.comments.push(data)
                })
            })
        })    
    },
    getTime(data) {
        // const postTime = data
        // var postTime = moment(data);
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
    addLikeComment(comment_ID,allike,index) {
        this.allLikecomment[index] = 1
        var like_comment = allike+1;
        firebase.firestore().collection('comments').doc(comment_ID).update({
            alllike_comments: like_comment
        });
        const time = moment().unix()
        const query =   firestore().collection('likeComments').add({
            comment_id: comment_ID ,
            user_id: this.expert.member_id,
            user_name: this.expert.fname + " " + this.expert.lname,
            likecomment_at : time
        })
        .then(function(docRef){
            // window.location.reload();
        })
        .catch(function(error){
            console.log("Edrror avdding Doocument : ",error);
        });
    },
    addLikePost(post_ID,all_likes) {
        this.alllike_post = all_likes+1 ;
        var like_post = all_likes+1;
            firebase.firestore().collection('posts').doc(this.$route.params.postID).update({
                all_likes: like_post
            });
        this.like_post = !this.like_post;
        this.unlike_post = !this.unlike_post;
        const time = moment().unix()
        const query =   firestore().collection('likePosts').add({
            post_id: post_ID ,
            // all_likes:all_likes+1,
            user_id: this.expert.member_id,
            user_name: this.expert.fname + " " + this.expert.lname,
            likepost_at : time
           
        })
        .then(function(docRef){
              
        })
        .catch(function(error){
        });
    },
    checkLikePost(){
      
        firestore().collection('likePosts').where('post_id', '==', this.$route.params.postID).where('user_id', '==', this.expert.member_id).get().then(collection => {
            const postLike = collection.docs.map(doc => {
            })
            if(postLike.length > 0){
                    this.unlike_post= false
                    this.like_post= true
            }
        })
    },
    checkAllLikePost(){
        firestore().collection('likePosts').where('post_id', '==', this.$route.params.postID).get().then(collection => {
                        const postAllLike = collection.docs.map(doc => {
                        })
                      
                       
            })
    },
    checkUserLikeComment(comment_ID){
         firestore().collection('likeComments').where('comment_id', '==', comment_ID).where('user_id', '==', this.expert.member_id).get().then(collection => {
                const count = collection.docs.length 
                this.Likecomment.push(count)
        })
      
    },
    checkAllLikeComment(comment_ID){
         firestore().collection('likeComments').where('comment_id', '==', comment_ID).get().then(collection => {
                const count = collection.docs.length 
                this.allLikecomment.push(count)
        })
    },    

    sharing(){
        this.isHidden = !this.isHidden;
    }
  },
}

</script>


<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';
.hello > span {
  padding: 1em;
}
    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        border-radius: 20px;
        border: 2px solid $main-color;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
    .expert-community-wrapper {
        padding: 40px;
        .header {
            font-size: 36px;
            font-weight: bold;
        }
    }
    .file-input {
        display: none;
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
    .danger-post {
        background-color: white;
        margin: 12px 12px;
        margin-left:6%;
        width: 50%;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $danger-color;
        border-radius: 20px;
        color: $danger-color;
        outline: none; 
    }
    .column {
        float: left;
        width: 50%;
        padding: 10px;
        height: 100%; 
    }
    .column-4 {
        float: left;
        width: 43%;
        padding: 10px;
        height: 100%; 
    }

    .column-2{
        float: left;
        width: 20%;
        padding: 10px;
        height:  100%; 
    }
    .column-1{
        float: left;
        width: 7%;
        // padding: 5px;
        height:  100%; 
    }
    .column-8{
        float: left;
        width: 80%;
        padding: 10px;
        height: 100%; 
    }
    .column-6{
        float: left;
        width: 60%;
        padding: 10px;
        height: 100%; 
    }
    .row:after {
        content: "";
        display: table;
        clear: both;
    }
     .btn-post {
        background-color: white;
        margin: 12px 12px;
        margin-left:6%;
        width: 50%;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $main-color;
        border-radius: 20px;
        color: $main-color;
        outline: none;
    }
     .form-control {
        margin: 12px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $main-color;
        border-radius: 20px;
        color: $main-color;
        outline: none;
    }
 
</style>
