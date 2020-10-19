<template>
 <div class="expert-community-wrapper" style="background-color:#e6e6e6">
<p class="header">สร้างโพสต์ในคอมมูนิตี้</p> 

  <div class="posts">
            <div class="row" >
            <br>
            <div class="column-4" style="background-color:#fff; text-align: center;border-radius: 10px;margin-right: 12px;" >
                <br>
                <img   v-if ="imageUrl == ''" width="100%" src="@/assets/logo.png" alt="sm-logo"  style="border-radius: 5px;">
                <img   :src="imageUrl"  width="100%" v-if="imageUrl" style="border-radius: 5px;">
                <label for="file-upload" class="custom-file-upload">
                   choose image
                </label>
                <input type="file" id="file-upload"  ref="image" accept="image/*"   @change="onFilePicked"  >
            </div>
            <!-- <div class="column-1"></div> -->
            <div class="column-4" style="background-color:#fff;border-radius: 10px;">
                <div class="row"  style="text-align: center;" >
                    <p style="text-align: left ;" >content :</p>  
                    <textarea name="post_content" id="post_content" cols="40" rows="12" v-model="post_content"   class="form-control" ></textarea>
                    <label for="post_content"></label>
                    <div class="row" style="text-align: center ;">
                         <button @click="saveData" class="btn-post">โพสต์</button>
                    </div>
                </div>
            </div>
        </div>
  </div>

 </div>
</template>
<script>
import firebase, { firestore, storage } from 'firebase'
import { mapState } from 'vuex'
import moment from 'moment'
import ImageModal from './components/ImageModal'
export default {
  props: [ 'message' ],
  name: 'posts',
  data () {
    return {
        post_content: null ,
        postRoomId: null,
        uploadTask: '',
        photo_url: null,
        dialog: false,
        imageName: "",
        imageUrl: "",
        imageFile: "",
        imgUrls: [],
        imageData: null,
    }
  },
  computed: {
    ...mapState({
        expert: state => state.user.data
    }),
     content_State() {
        return this.post_content != null ? true : false
      }
  },
  created() {
    // this.getImages();
  },
  methods: {
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
        this.imageUrl = "";
      }
    },
    saveData(){
        if(this.post_content != null){
                    firebase.storage().ref(`postImages/${this.makeId(10)}`).put(this.imageData).then(response => {
                        const time = moment().unix()
                        firestore().collection('posts').add({
                                        post_content: this.post_content ,
                                        create_user: this.expert.member_id,
                                        post_id : null,
                                        post_image : response.metadata.fullPath,
                                        post_at : time,
                                        update_user : null,
                                        all_likes : 0,
                                        all_comments : 0
                            })
                            .then(function(docRef){
                            })
                            .catch(function(error){
                                console.log("Edrror avdding Doocument : ",error);
                            });
                        this.$router.push('/communities')
                    })

        }else if(this.imageData == null){
           alert('pls fill your img content');
        }else{
           alert('pls fill your content');
        }
    },
    makeId(length) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/theme/variables.scss';
@import '@/theme/responsive.scss';
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
    .column {
        float: left;
        width: 50%;
        padding: 10px;
        height: 100%; /* Should be removed. Only for demonstration */
    }
    .column-4 {
        float: left;
        width: 43%;
        padding: 10px;
        height: 100%; /* Should be removed. Only for demonstration */
    }
    .column-1{
        float: left;
        width: 4%;
        padding: 10px;
        height: 600px; /* Should be removed. Only for demonstration */
    }
    /* Clear floats after the columns */
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
        padding: 25px;
    }
     .form-control-danger {
        margin: 12px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 2px solid $danger-color;
        border-radius: 20px;
        color: $danger-color;
        outline: none;
        padding: 25px;
    }
 
</style>
