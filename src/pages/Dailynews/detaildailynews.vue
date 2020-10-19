<template>
    <div class="drug-detail-wrapper">
        <div class="drug-detail-content-wrapper"  v-if ="daily_id != 'null'">
            <p class="header">แก้ไข Daily news</p> 
        </div>
        <div class="drug-detail-content-wrapper"  v-if ="daily_id == 'null'">
            <p class="header">เพิ่ม Daily news ในระบบ</p> 
        </div>
        <div class="dailynew">
                <div class="row" style="width:100%">
                    <br>
                    <div class="column-4" style="background-color:#fff; text-align: center;border-radius: 10px;width:40%" >
                        <br>
                        <img   v-if ="imageUrl == '' || imageUrl == null" width="100%" src="@/assets/logo.png" alt="sm-logo"  style="border-radius: 5px;">
                        <img   :src="imageUrl"  width="100%" v-if="imageUrl" style="border-radius: 5px;">
                        <label for="file-upload" class="custom-file-upload">
                            choose image
                        </label> 
                        <input  type="file" ref="image"  id="file-upload" accept="image/*" @change="onFilePicked">
                    </div>
                    <div class="column-6" style="background-color:#fff; text-align: right;border-radius: 10px;width:60%" >               
                                           
                        <div>
                            <p style="text-align: left ;" >topic (1 - 30  character) :</p>  
                            <textarea id="topic" cols="50" rows="1" v-model="topic"   maxlength="30" style="padding: 9px;    width: 100%;" class="form-control" ></textarea>
                        </div>                        
                        <div>
                            <p style="text-align: left ;" >header (1 - 180  character): </p>  
                            <textarea id="header" cols="50" rows="5" v-model="header" maxlength="180" style="padding: 9px;    width: 100%;" class="form-control" ></textarea>
                        </div>                        
                        <div>
                            <p style="text-align: left ;" >like ref. :</p>  
                            <input type="url" v-model="link_ref"  style="padding: 9px;    width: 100%;" class="form-control" >
                        </div>  
                        <!-- {{body_1.length}}   -->
                        <!-- {{body_2.length}}   -->
                        <div>
                           <button type="submit" class="danger-post "  @click="deleteDailynews"  v-if ="daily_id != 'null'">ลบข้อมูล</button>
                           <button type="submit" class="custom-file-upload"  @click="updateDailynews"  v-if ="daily_id != 'null'">บันทึกข้อมูล</button>
                        
                        </div>
                        <div>
                           <button type="submit" class="custom-file-upload"  @click="addDailynews"  v-if ="daily_id == 'null'">บันทึกข้อมูล</button>
                        </div>                        
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
import dailynewAPI from '@/api/dailynew'
import moment from 'moment'

export default {
    name: 'medicine',
     components: {
    },
    data() {
        return {
            daily_id : '',
            topic : '',
            header : '',
            header : '',
            link_ref : '',
            body_1 : 'คณปวดไมเกรนบอยตองกนยาปองกน1คณปวดไมเกรนบอยตองกนยาปองกน2คณปวดไมเกรนบอยตองกนยาปองกน3คณปวดไมเกรนบอยตองกนยาปองกน4คณปวดไมเกรนบอยตองกนยาปองกน5คณปวดไมเกรนบอยตองกนยาปองกน6คณปวดไมเกรนบอยตองกนยาปอ',
            body_2 : 'คณปวดไมเกรนบอยตองกนยาปองกน1ค',
            imageName : "",
            imageFile : "",
            imageUrl : '' ,
        }
    }, 
    beforeMount() {
        this.daily_id = this.$route.params.dailynewID;
    },
    created() {
        if(this.$route.params.dailynewID == 'null'){
        }else{
            this.getDailynews()
        }
    },
    mounted() { 
    },
    methods: {
        moment,
        getDailynews(){
            dailynewAPI.getDailynewsById(this.$route.params.dailynewID).then(response => {
                this.daily_id  = response[0]['dn_id']
                this.topic = response[0]['topic']
                this.header = response[0]['header']
                this.link_ref = response[0]['link_ref']
                this.add_dtm = response[0]['add_dtm']
                this.imageUrl   = response[0]['dn_image']
            })
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
        deleteDailynews(){
            const id = this.daily_id
            dailynewAPI.deleteDailynews(id)
            this.$router.push(`/dailynews`)
        },
        updateDailynews(){
            const id = this.daily_id
            const body = {
               dn_id: this.daily_id,
               topic: this.topic,
               header: this.header,
               link_ref: this.link_ref,
               dn_image : this.imageUrl 
            }
            dailynewAPI.updateDailynews(id, body)
            this.$router.push(`/dailynews/${id}`)
            // location.reload()
        },
        addDailynews(){
            const body = {
                topic: this.topic,
                header: this.header,
                link_ref: this.link_ref,
                dn_image : this.imageUrl 
            }
            dailynewAPI.addDailynews(body)
            this.$router.push(`/dailynews`)
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
    .custom-select-option {
        // border-radius: 20px;
          border-radius: 15px;
        border: 1px solid $main-color;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
.drug-detail-wrapper {
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
    .column-4 {
        float: left;
        width: 43%;
        padding: 10px;
        height: 100%; 
    }
    .column-6 {
        float: left;
        width: 57%;
        padding: 10px;
        height: 100%; 
    }
        .form-control {
        margin: 12px 12px;
        align-self: center;
        padding: 4px 10px;
        border: 1px solid $main-color;
        border-radius: 15px;
        color: $main-color;
        outline: none;
    }
        .danger-post {
               border-radius: 20px;
        border: 2px solid $main-color;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;

        // background-color: white;
        // margin: 12px 12px;
        // margin-left:6%;
        // width: 50%;
        // align-self: center;
        // padding: 4px 10px;
        border: 2px solid $danger-color;
        border-radius: 20px;
        color: $danger-color;
        outline: none; 
    }
}

    
</style>
