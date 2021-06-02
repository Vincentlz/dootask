export default {
    /**
     * 切换项目聊天显隐
     * @param state
     */
    toggleProjectChatShow(state) {
        state.projectChatShow = !state.projectChatShow
        state.setStorage('projectChatShow', state.projectChatShow);
    },

    /**
     * 切换项目面板显示类型
     * @param state
     */
    toggleProjectListPanel(state) {
        state.projectListPanel = !state.projectListPanel
        state.setStorage('projectListPanel', state.projectListPanel);
    },

    /**
     * 更新会员信息
     * @param state
     * @param info
     */
    setUserInfo(state, info) {
        const userInfo = state._cloneJSON(info);
        userInfo.userid = state._runNum(userInfo.userid);
        userInfo.token = userInfo.userid > 0 ? (userInfo.token || state.userToken) : '';
        state.userInfo = userInfo;
        state.userId = userInfo.userid;
        state.userToken = userInfo.token;
        state.setStorage('userInfo', state.userInfo);
    },

    /**
     * 获取项目信息
     * @param state
     * @param project_id
     */
    getProjectDetail(state, project_id) {
        if (state._isJson(state.cacheProject[project_id])) {
            state.projectDetail = state.cacheProject[project_id];
        }
        state.projectDetail.id = project_id;
        //
        if (state.cacheProject[project_id + "::load"]) {
            return;
        }
        state.cacheProject[project_id + "::load"] = true;
        //
        state.projectLoad++;
        $A.apiAjax({
            url: 'project/detail',
            data: {
                project_id: project_id,
            },
            complete: () => {
                state.projectLoad--;
                state.cacheProject[project_id + "::load"] = false;
            },
            success: ({ret, data, msg}) => {
                if (ret === 1) {
                    state.cacheProject[project_id] = data;
                    if (state.projectDetail.id == project_id) {
                        state.projectDetail = data;
                    }
                } else {
                    $A.modalError(msg);
                }
            }
        });
    },

    /**
     * 获取用户基本信息
     * @param state
     * @param params {userid, success, complete}
     */
    getUserBasic(state, params) {
        if (!state._isJson(params)) {
            return;
        }
        const {userid, success, complete} = params;
        if (typeof success === "function") {
            if (state._isArray(userid)) {
                userid.forEach((uid) => {
                    state.cacheUserBasic[uid] && success(state.cacheUserBasic[uid], false)
                });
            } else {
                state.cacheUserBasic[userid] && success(state.cacheUserBasic[userid], false)
            }
        }
        $A.apiAjax({
            url: 'users/basic',
            data: {
                userid: userid
            },
            complete: () => {
                typeof complete === "function" && complete()
            },
            success: ({ret, data, msg}) => {
                if (ret === 1) {
                    data.forEach((item) => {
                        state.cacheUserBasic[item.userid] = item;
                        typeof success === "function" && success(item, true)
                    });
                } else {
                    $A.modalError(msg);
                }
            }
        });
    }
}
