//公告类
export type Announcement={
    id:number;
    title:string;//公告标题
    content:string;//公告内容(富文本内容)
    create_time:string;//创建时间
    founder:string;//创建人
    status:number;//公告状态(“草稿”、“已发布”或“已撤销”)
}