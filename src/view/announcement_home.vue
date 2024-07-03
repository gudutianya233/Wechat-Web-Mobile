<!-- 公告页面 -->
<script lang="ts" setup>
import { Announcement } from '../entities/announcement.entities';
import { getAnnouncement, getAnnouncementCount } from '../request/index';
import { CloseBold } from '@element-plus/icons-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor } from '@wangeditor/editor-for-vue'
const editorRef = shallowRef()
const mode = 'default'
const editorConfig = {
    readOnly: true
}
const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
let isRequested = false //用一个变量来保证只发起一次请求，防止因为dom变化而导致重复请求
const dialogVisible = ref(false);
const initialAnnouncement: Announcement = {
    id: 1,
    title: '公告标题',
    content: '公告内容',
    create_time: '创建时间',
    founder: '创建人',
    status: 1
};
//如果公告少于6条，则不显示查看更多
let show_see_mode = false
const selectedAnnouncement = ref<Announcement>(initialAnnouncement);
const announcement_lists: Ref<Announcement[] | null> = ref(null);
//跳过的记录数
let skip = 0;
//每次获取5条数据
const take = 5;
onMounted(async () => {
    if (!isRequested) {
        // 发送请求
        isRequested = true
        const res: number = await getAnnouncementCount()
        //公告条数少于6条
        if (res < 6) { }
        else {
            show_see_mode = true
        }
        const ress: any = await getAnnouncement(skip, take)
        if (ress) {
            announcement_lists.value = ress.Announcements
        }
        console.log(ress)
        console.log(announcement_lists.value)
    }

})
function checkAnnouncement(announcement: Announcement) {
    selectedAnnouncement.value = announcement;
    //  console.log(selectedAnnouncement.value )
    dialogVisible.value = true;
}
function closeDialog() {
    dialogVisible.value = false;
}
function see_more() {
    // 增加 skip 参数的值
    skip += take;
    // 获取更多的公告
    getAnnouncement(skip, take).then((res) => {
        if (res) {
            console.log(res)
            // 将新获取的公告添加到列表中
            if (announcement_lists.value != null) {
                announcement_lists.value = [...announcement_lists.value, ...res.announcements];
            }
            // 如果返回的参数hasMore为true，表示还有数据，为false则已经查询完所有公告了，则隐藏“查看更多”按钮
            if (!res.hasMore) {
                show_see_mode = false;
            }
        }
    });
}
</script>
<template>
    <div v-for="item in announcement_lists" :key="item.id" class="announcement" @click="checkAnnouncement(item)">
        <div class="announcement_title">{{ item.title }}</div>
        <div class="announcement_release_time">{{ item.create_time }}</div>
    </div>
    <div>
        <See_more v-if="show_see_mode" @click="see_more"></See_more>
    </div>
    <div v-show="dialogVisible"  class="announcement_dialog">
        <div style="position: relative;"> 
            <div class="announcement_dialog_title" style="padding-right: 2rem;"> {{ selectedAnnouncement.title }}</div>
            <div class="announcement_dialog_close" > <el-button type="danger" :icon="CloseBold" circle @click="closeDialog"/></div>
        </div>
        <div style="border: 1px solid #ccc;height: 80%;">
            <Editor style="height: 100%; overflow-y: hidden;" v-model="selectedAnnouncement.content"
                :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
        </div>
        <div style="height: 3rem;line-height: 3rem;"> {{ selectedAnnouncement.create_time }}</div>
    </div>
</template>

<style lang="less" scoped>
.announcement {
    background-color: #ffffff;
    width: 90%;
    margin: auto;
    margin-top: 1rem;
    height: 6rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    text-align: left;
    padding-left: 1rem;
    padding-top: 1rem;

    .announcement_title,
    .announcement_release_time {
        height: 2rem;
    }

    // .announcement_content {
    //     height: 3rem;
    //     line-height: 1rem;
    //     margin-top: 0.5rem;
    //     //     white-space: nowrap;
    //     //   overflow: hidden;
    //     //   text-overflow: ellipsis;
    //     display: -webkit-box;
    //     -webkit-box-orient: vertical;
    //     -webkit-line-clamp: 3;
    //     /* 指定最多显示的行数 */
    //     overflow: hidden;
    // }
}

.announcement_dialog {
    background-color: #ffffff;
    width: 90%;
    margin: auto;
    border: 1px solid black;
    border-radius: 1rem;
    font-size: 1.5rem;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 36rem;
    display: flex;
    flex-direction: column;
}
.announcement_dialog_close{
    position: absolute;
    right: -0.8rem;
    top: -1.2rem;
    color: red;
}
</style>