export default {
    state: {
        imageVisible: false, //  图片查看组件显隐状态
        imageList: [], //  图片列表
        defaultActiveIndex: 0, //  默认当前打开的图片的索引
    },
    mutations: {
        setImageViewData(state, data) {
            if (data.imageVisible) {
                state.imageVisible = data.imageVisible;
                state.imageList = data.imageList;
                state.defaultActiveIndex = data.activeIndex;
            } else {
                state.imageVisible = false;
                state.imageList = [];
                state.defaultActiveIndex = 0;
            }
        },
    },
};