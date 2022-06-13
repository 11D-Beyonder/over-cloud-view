export default {
    state: {
        columnList: ["size", "updateTime", "type"],
        selectedColumnList: sessionStorage.getItem("selectedColumnList"),
        displayMode: sessionStorage.getItem("displayMode")
    },
    mutations: {
        changeSelectedColumnList(state, data) {
            sessionStorage.setItem("selectedColumnList", data.toString());
            state.selectedColumnList = data.toString();
        },
        changeDisplayMode(state,data){
            sessionStorage.setItem('displayMode',data);
            state.displayMode=data
        }
    }
};