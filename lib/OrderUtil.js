export function caculateOrder(order){
    console.log("calc in 1") ;
    console.log( order.rootServiceCategories) ;
    order.rootServiceCategories.forEach(rootCategory => {
      if( rootCategory.id != '4' ) {
        console.log("calc ing") ;
        rootCategory.totalCareMins = _.sumBy(rootCategory.details, d => d.careMins || 0);
        rootCategory.subtotalPrice = _.sumBy(rootCategory.details, d => d.price * d.qty);
        console.log("rootCategory.subtotalPrice : " + rootCategory.subtotalPrice) ;
      }
    });

  let root4 = order.rootServiceCategories.find(root => root.id === '4');
  console.log("root4 : " + root4) ;
  if(root4){                              // 家事管家計算 (以時間算錢), 單價、時間都有可能被修改.
    const detail = root4.details[0];      // 以第一筆項目的時間、價錢作基準
    root4.subtotalPrice = parseInt(root4.totalCareMins / detail.careMins * detail.price);
    if(root4.cleanSupply === '2') root4.subtotalPrice += 100;
    // 因家事管家的 totalCareMins 可被修改, 所以需要自行指定, 不自動計算.
  } 

  order.totalPrice = _.sumBy(order.rootServiceCategories, r => r.subtotalPrice);
};

/** 重設 totalCareMins 為預設值 */
export function resetTotalCareMins(rootCategory) {
  rootCategory.totalCareMins = _.sumBy(rootCategory.details, d => (d.careMins || 0) * d.qty);
  rootCategory.totalCareMins += getCleanSizeMins(rootCategory.cleanSize);      // 重新加上坪數差異
};

/** 修改家事管家的 "鐘點費" 欄位需要同步所有家事管家項目的單價設定  */
export function modifyHourPrice(order, rootCategory, hourPrice){
  if(rootCategory.id === '4'){
    rootCategory.details.foreach(item => item.price = hourPrice);
    caculateOrder(order);           // 單價修改後, 重新計算訂單價錢.
  }
};

export function getCleanSizeMins(cleanSize){
  return (parseInt(cleanSize) - 1) * 30;
}