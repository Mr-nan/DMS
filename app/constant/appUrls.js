/**
 * 开发地址
 */
// export const BASEURL = 'http://dev.dms.dycd.com/qkcApi/';

/**
 * 测试地
 */
export const BASEURL = 'http://test.dms.dycd.com/qkcApi/';

/**
 * 正式地址
 */
// export const BASEURL = 'http://dms.dycd.com/qkcApi/';

/**
 * 预发布地址
 */
// export const BASEURL = 'http://st.dms.dycd.com/qkcApi/';

/**
 * 登录接口
 */
export const USER_LOGIN = BASEURL + "user/login";


/**
 * APP更新接口
 */
export const APPUPDATE = BASEURL + "App/update_qkc";

/**
 * 评估客户列表接口
 */
export const USERCUSTOMERLIST = BASEURL + "user/customerList";

/**
 * 评估线下库融车辆列表
 */
export const INVENTORYFINANCINGGETAUTOLIST = BASEURL + "InventoryFinancing/getAutoList";

/**
 * 评估客户是否有单车线下订单
 */
export const USERGETPAYMENTCOUNT = BASEURL + "user/getPaymentCount";

/**
 * 评估单车订单列表
 */
export const ONECARGETPAYMENTLIST = BASEURL + "OneCar/getPaymentList";

/**
 * 评估单车车辆列表
 */
export const ONECARGETAUTOLIST = BASEURL + "OneCar/getAutoList";

/**
 * 评估库融车辆详情
 */
export const INVENTORYFINANCINGGETAUTOINFO = BASEURL +
    "InventoryFinancing/getAutoInfo";

/**
 * 评估单车车辆详情
 */
export const ONECARGETAUTOINFO = BASEURL + "OneCar/getAutoInfo";

/**
 * 评估查看部位列表
 */
export const AUTOGETVIEWINGPOSITION = BASEURL + "auto/getViewingPosition";

/**
 * 评估全库存检测车架号
 */
export const AUTOCHECKVIM = BASEURL + "auto/checkvim";

/**
 * 根据车架号获取车型
 */
export const GETCARMODELBYVIN = BASEURL + "Auto/getCarModelByVIN";

/**
 * 评估获取监管地点
 */
export const AUTOGETRUNPLACE = BASEURL + "auto/getRunPlace";

/**
 * 评估选择车型品牌列表
 */
export const AUTOGETBRANDLIST = BASEURL + "auto/getBrandList";

/**
 * 评估选择车型车系列表
 */
export const AUTOGETSERIESLIST = BASEURL + "auto/getSeriesList";

/**
 * 评估选择车型车型列表
 */
export const AUTOGETMODELLIST = BASEURL + "auto/getModelList";

/**
 * 评估车300和车虫网价格
 */
export const AUTOGETPRICE = BASEURL + "auto/getPrice";

/**
 * 获取综合参考价
 */
export const AUTOGETESTIMATEPRICE = BASEURL + "Auto/getEstimatePrice";

/**
 * 评估获取折扣率与评估放款额
 */
export const AUTOGETREBATEMNY = BASEURL + "auto/getRebateMny";

/**
 * 评估附件列表
 */
export const AUTOGETATTACHMENTLIST = BASEURL + "auto/getAttachmentList";

/**
 * 评估上传图片
 */
export const FILEUPLOAD = BASEURL + "File/upload";

/**
 * 评估线下库融添加新车
 */
export const INVENTORYFINANCINGADDAUTO = BASEURL + "InventoryFinancing/addAuto";

/**
 * 评估线上库容订单列表
 */
export const INVENTORYFINANCINGLOANLIST = BASEURL + "InventoryFinancing/loanList";

/**
 * 评估线上库容车辆列表
 */
export const INVENTORYFINANCINGLOANAUTOLIST = BASEURL +
    "InventoryFinancing/loanAutoList";

/**
 * 评估单车添加新车
 */
export const ONECARADDAUTO = BASEURL + "OneCar/addAuto";

/**
 * 评估库容删除车辆
 */
export const INVENTORYFINANCINGDELAUTO = BASEURL + "InventoryFinancing/delAuto";

/**
 * 评估单车删除车辆
 */
export const ONECARDELAUTO = BASEURL + "OneCar/delAuto";

/**
 * 评估库容二次评估
 */
export const INVENTORYFINANCINGRESETPRICE = BASEURL +
    "InventoryFinancing/resetPrice";

/**
 * 评估库容编辑
 */
export const INVENTORYFINANCINGEDITAUTO = BASEURL + "InventoryFinancing/editAuto";

/**
 * 评估单车编辑
 */
export const ONECAREDITAUTO = BASEURL + "OneCar/editAuto";

/**
 * 评估单车二次评估
 */
export const ONECARRESETPRICE = BASEURL + "OneCar/resetPrice";

/**
 * 全库存客户列表
 */
export const WHOLESTOCKPILEGETCUSTOMERLIST = BASEURL +
    "WholeStockpile/getCustomerList";

/**
 * 全库存车辆列表
 */
export const WHOLESTOCKPILEGETAUTOLIST = BASEURL + "WholeStockpile/getAutoList";

/**
 * 全库存车辆详情
 */
export const WHOLESTOCKPILEGETAUTOINFO = BASEURL + "WholeStockpile/getAutoInfo";

/**
 * 获取车300价格接口
 */
export const AUTOGETCARSANBAIPRICE = BASEURL + "Auto/getCarSanBaiPrice";

/**
 * 全库存添加车辆
 */
export const WHOLESTOCKPILEADDAUTO = BASEURL + "WholeStockpile/addAuto";

/**
 * 全库存编辑车辆
 */
export const WHOLESTOCKPILEEDITAUTO = BASEURL + "WholeStockpile/editAuto";

/**
 * 收车用户列表
 */
export const CARREVGETUSERLIST = BASEURL + "CarRev/getUserList";

/**
 * 收车车辆列表
 */
export const CARREVGETREVLIST = BASEURL + "CarRev/getRevList";

/**
 * 收车提交数据
 */
export const CARREVSUBMITREVDATA = BASEURL + "CarRev/submitRevData";

/**
 * 盘库客户列表
 */
export const CARCHECKUSER_GETBUSILIST = BASEURL + "CarCheck/user_getBusiList";

/**
 * 盘库车辆列表
 */
export const CARCHECKLOADCHKSTOREDATA = BASEURL + "CarCheck/loadChkStoreData";

/**
 * 盘库成功车辆列表
 */
export const CARCHECKLOADCOMPLETEDCHKDATA = BASEURL +
    "CarCheck/loadCompletedChkData";


/**
 * 盘库异常字典码
 */
export const AUTOGETEXCEPTIONDICTLIST = BASEURL + "Auto/getExceptionDictList";

/**
 * 盘库提交
 */
export const CARCHECKSUBMITCHKDATA = BASEURL + "CarCheck/submitChkData";

/**
 * 盘库批量提交
 */
export const CARCHECKPATCHSUBMITCHKDATA = BASEURL + "CarCheck/patchSubmitChkData";

/**
 * 线下库融添加已有车辆
 */
export const INVENTORYFINANCINGADDWHOLESTOCKPILEAUTO = BASEURL +
    "InventoryFinancing/addWholeStockpileAuto";


/**
 * 单车添加已有车辆
 */
export const ONECARADDWHOLESTOCKPILEAUTO = BASEURL +
    "OneCar/addWholeStockpileAuto";

/**
 * 巡查报告结果
 */
export const PATROLEVALGETMERGEPATROLEVALRESULT = BASEURL +
    "patrolEval/getMergePatrolEvalResult";

/**
 * 巡查报告客户列表
 */
export const PATROLEVALGETMERGELIST = BASEURL +
    "patrolEval/getMergeList";

/**
 * 巡查报告提交
 */
export const PATROLEVALSAVEUPDATEPATROLEVAL = BASEURL +
    "patrolEval/saveUpdatePatrolEval";

/**
 * 采购贷订单列表
 */
export const PURCHA_PAYMENTLIST = BASEURL +
    "purcha/paymentList";

/**
 * 登录获取验证码
 */
export const USER_IMG_CODE = BASEURL +
    "user/img_code";

/**
 * 采购贷车辆列表
 */
export const PURCHAAUTOLIST = BASEURL +
    "purcha/autoList";

/**
 * 采购贷车辆详情
 */
export const PURCHA_AUTODETAIL = BASEURL +
    "purcha/autoDetail";

/**
 * 采购贷车辆二评修改
 */
export const PURCHA_AUTOASSESS = BASEURL +
    "purcha/autoAssess";

/**
 * 采购贷收车补充随车资料
 */
export const CARREV_SUPPLYAUTODATA = BASEURL +
    "CarRev/supplyAutoData";

/**
 * obd商户列表
 */
export const OBD_CUSTOMER_LIST = BASEURL +
    "ObdReg/getUserList";

/**
 * obd车辆列表
 */
export const OBD_CAR_LIST = BASEURL +
    "ObdReg/getObdRegulationCarList";

/**
 * obd监管详情
 */
export const OBD_CAR_DETAIL = BASEURL +
    "ObdReg/getObdCarDetail";

/**
 * obd审核记录
 */
export const OBD_CHECKOUT_RECORD = BASEURL +
    "ObdReg/getMergeThresholdWarnAuditRecord";

/**
 * obd绑定
 */
export const REGRFIDTOOBD = BASEURL +
    "CarRev/ObdBindAgain";

/**
 * 异常说明
 */
export const ALARM_EXPLAIN = BASEURL +
    "ObdReg/alarmExplain";

/**
 * 扫描标签
 */
export const REGOBDTORFID = BASEURL +
    "CarRev/regObdToRfid";