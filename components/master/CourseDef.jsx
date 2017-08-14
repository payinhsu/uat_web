import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import ItemPicker from 'components/ItemPicker';
import ItemPicker104 from 'components/ItemPicker104';
import Document from 'components/Document';
import ability104 from 'mappings/ability104';
import position104 from 'mappings/position104';
import skill104 from 'mappings/skill104';
import tool104 from 'mappings/tool104';
// import tv4 from 'tv4';
import tv4 from 'lib/tv4';
import {SCHEMA_NEW_COURSE_DEF} from 'lib/schema';
import {get104ItemsByIds} from 'lib/mappingUtil';
import * as CourseActions from 'actions/master/CourseActions';
import * as DefinitionActions from 'actions/master/DefinitionActions';

export default class NewCourseDef extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // dialog control
      openCourseCatePicker: false,
      openPositionPicker: false,
      openAbilityPicker: false,
      openToolPicker: false,
      openSkillPicker: false,

      // apiModel: props.master.courseDef || NewCourseDef.emptyCourseDefModel
      apiModel: props.params && props.params.courseDefId ? props.master.courseDef : this.emptyCourseDefModel()
    };
    console.log('re-construct CourseDef.jsx');
    this.state.editModel = this.toEditModel(this.state.apiModel);
  }

  /** load category & courseDef by courseDefId specified in path param */
  static onEnter(store){
    return (nextState, replace, callback) => {
      DefinitionActions.getDefinitions()(store.dispatch, store.getState).then(() => {
        if(nextState.params && nextState.params.courseDefId){
          CourseActions.getCourseDef(nextState.params.courseDefId)(store.dispatch, store.getState).then(() => callback());
        }
        else callback();
      });
    }
  }

  componentDidMount() {
    if(this.props.params && this.props.params.courseDefId){
      this.props.getCourseDef(this.props.params.courseDefId);
    }
  };

  emptyCourseDefModel(){
    return{
      name: '',
      totalTime:{
        hours: 0,
        mins: 0
      },
      price: 0,
      level: 'L',
      rootCategoryIds:[],
      imageFileKey: undefined,
      videoFileKey: undefined,
      organizationId: '1',
      brief: '',
      summaries: '',
      schedules: [],
      suitable: '',
      remark: '',
      afterLearn: {
        positions: [],
        abilities: [],
        tools: [],
        skills: []
      },
      // 以下非 api model
      imageFileNam: '',
      videoFileName: '',

      imageThumbnailPath: undefined,
      videoThumbnailPath: undefined
    };
  };

  createCourseDef = () => {
    const courseDef = this.toApiModel(this.state.editModel);
    let valid = tv4.validate(courseDef, SCHEMA_NEW_COURSE_DEF);
    if(tv4.error){
      if (tv4.error.message === 'name' || tv4.error.dataPath.indexOf('name') > -1 ) {
        window.alert( "課程名稱項目為必填");
      }else if (tv4.error.message === 'rootCategoryIds' || tv4.error.dataPath.indexOf('rootCategoryIds') > -1) {
        window.alert( "課程分類項目為必填");
      }else if (tv4.error.message === 'totalTime' || tv4.error.dataPath.indexOf('totalTime') > -1) {
        window.alert( "基本時數項目為必填");
      }else if (tv4.error.message === 'price' || tv4.error.dataPath.indexOf('price') > -1) {
        window.alert( "課程定價項目為必填");
      }else if (tv4.error.message === 'level' || tv4.error.dataPath.indexOf('level') > -1) {
        window.alert( "課程等級項目為必填");
      }else if (tv4.error.message === 'imageFileKey' || tv4.error.dataPath.indexOf('imageFileKey') > -1) {
        window.alert( "課程圖片項目為必填");
      }else if (tv4.error.message === 'organizationId' || tv4.error.dataPath.indexOf('organizationId') > -1) {
        window.alert( "主辦單位項目為必填");
      }else if (tv4.error.message === 'brief' || tv4.error.dataPath.indexOf('brief') > -1) {
        window.alert( "課程簡介項目為必填");
      }else if (tv4.error.message === 'summaries' || tv4.error.dataPath.indexOf('summaries') > -1) {
        window.alert( "課程大綱項目為必填");
      }else if (tv4.error.message === 'suitable' || tv4.error.dataPath.indexOf('suitable') > -1) {
        window.alert( "適合對象項目為必填");
      }
    }
    else{
      console.log('this.props.createCourseDef > ' + typeof this.props.createCourseDef);
      this.props.createCourseDef(courseDef).then(this.props.history.goBack());
    }
  };

  updateCourseDef = () => {
    const courseDef = this.toApiModel(this.state.editModel);
    let valid = tv4.validate(courseDef, SCHEMA_NEW_COURSE_DEF);
    if(tv4.error){
      if (tv4.error.message === 'name' || tv4.error.dataPath.indexOf('name') > -1 ) {
        window.alert( "課程名稱項目為必填");
      }else if (tv4.error.message === 'rootCategoryIds' || tv4.error.dataPath.indexOf('rootCategoryIds') > -1) {
        window.alert( "課程分類項目為必填");
      }else if (tv4.error.message === 'totalTime' || tv4.error.dataPath.indexOf('totalTime') > -1) {
        window.alert( "基本時數項目為必填");
      }else if (tv4.error.message === 'price' || tv4.error.dataPath.indexOf('price') > -1) {
        window.alert( "課程定價項目為必填");
      }else if (tv4.error.message === 'level' || tv4.error.dataPath.indexOf('level') > -1) {
        window.alert( "課程等級項目為必填");
      }else if (tv4.error.message === 'imageFileKey' || tv4.error.dataPath.indexOf('imageFileKey') > -1) {
        window.alert( "課程圖片項目為必填");
      }else if (tv4.error.message === 'organizationId' || tv4.error.dataPath.indexOf('organizationId') > -1) {
        window.alert( "主辦單位項目為必填");
      }else if (tv4.error.message === 'brief' || tv4.error.dataPath.indexOf('brief') > -1) {
        window.alert( "課程簡介項目為必填");
      }else if (tv4.error.message === 'summaries' || tv4.error.dataPath.indexOf('summaries') > -1) {
        window.alert( "課程大綱項目為必填");
      }else if (tv4.error.message === 'suitable' || tv4.error.dataPath.indexOf('suitable') > -1) {
        window.alert( "適合對象項目為必填");
      }
    }
    else{
      console.log('this.props.createCourseDef > ' + typeof this.props.createCourseDef);
      this.props.updateCourseDef(courseDef).then(this.props.history.goBack());
    }
  };

  /** view model to api model (for api access) */
  toApiModel = (courseDef) =>{
    return Object.assign({}, courseDef,
      {
        totalTime: {
          hours: parseInt(courseDef.totalTime.hours),
          mins: parseInt(courseDef.totalTime.mins)
        },
        price: parseInt(courseDef.price),
        afterLearn:{
          positions: courseDef.afterLearn.positions.map(position => position.idLevel3),
          abilities: courseDef.afterLearn.abilities.map(ability => ability.idLevel3),
          tools: courseDef.afterLearn.tools.map(tool => tool.idLevel3),
          skills: courseDef.afterLearn.skills.map(skill => skill.idLevel3)
        }
      }
    )
  };

  /** api model to edit model (for editing) */
  toEditModel = (courseDef) =>{
    return Object.assign({}, courseDef, {
      afterLearn:{
        positions: get104ItemsByIds('position', courseDef.afterLearn.positions),
        abilities: get104ItemsByIds('ability', courseDef.afterLearn.abilities),
        tools: get104ItemsByIds('tool', courseDef.afterLearn.tools),
        skills: get104ItemsByIds('skill', courseDef.afterLearn.skills)
      }
    });
  }

  onCourseCategoriesPicked  = (courseCategories) => {
    this.state.editModel.rootCategoryIds = courseCategories.map(cate => cate.id);
    this.setState({
      openCourseCatePicker: false,
      editModel: this.state.editModel
    });
  }

  onClosePicker = () => {
    this.setState({
      openCourseCatePicker: false,
      openPositionPicker: false,
      openAbilityPicker: false,
      openToolPicker: false,
      openSkillPicker: false
    });
  };

  onPositionPicked = (positions) => {
    this.state.editModel.afterLearn.positions = positions;
    this.setState({
      openPositionPicker: false,
      editModel: this.state.editModel
    });
  };

  onAbilityPicked = (abilities) => {
    this.state.editModel.afterLearn.abilities = abilities;
    this.setState({
      openAbilityPicker: false,
      editModel: this.state.editModel
    });
  };

  onToolsPicked = (tools) => {
    this.state.editModel.afterLearn.tools = tools;
    this.setState({
      openToolPicker: false,
      editModel: this.state.editModel
    });
  };

  onSkillPicked = (skills) => {
    this.state.editModel.afterLearn.skills = skills;
    this.setState({
      openSkillPicker: false,
      editModel: this.state.editModel
    });
  }

  onConfirmSchdule = (schedule) => {
    this.onClosePicker();
    this.state.editModel.schedules.push(schedule);
    this.setState({
      openCourseDefSchedule: false,
      editModel: this.state.editModel
    });
  };

  // handleChangeCourseAttribute = (e) => {};

  handleTotalTimeHoursChange = (e) => {
    this.state.editModel.totalTime.hours = e.target.value;
    this.setState({editModel: this.state.editModel});
  };

  handleTotalTimeMinsChange = (e) => {
    this.state.editModel.totalTime.mins = e.target.value;
    this.setState({editModel: this.state.editModel});
  };

  // handleUploadImage = (fileKey, fileName) => {
  //   e.preventDefault();
  //   this.state.editModel.imageFileName = e.target.files[0].name;
  //   this.setState({editModel: this.state.editModel});
  //   console.log(JSON.stringify(this.state));
  // };

  // handleUploadVideo = (fileKey, fileName) => {
  //    e.preventDefault();
  //   this.state.editModel.videoFileName = e.target.files[0].name;
  //   this.setState({editModel: this.state.editModel});
  // }

  handleUploadImage = (fileKey, fileName) => {
    this.state.editModel.imageFileKey = fileKey;
    this.state.editModel.imageFileName = fileName;
    this.setState({editModel: this.state.editModel});
    console.log(JSON.stringify(this.state));
  };

  handleUploadVideo = (fileKey, fileName) => {
    this.state.editModel.videoFileKey = fileKey;
    this.state.editModel.videoFileName = fileName;
    this.setState({editModel: this.state.editModel});
    console.log(JSON.stringify(this.state));
  }

    // 上傳並取得程課圖片後更新的 callback
  handleChangeImage = (field, url) => {
    this.state.editModel[field] = url;
    this.setState({editModel:this.state.editModel});
  }

  changeCourseDef(field, e){
    console.log('change courseDef ============');
    e.preventDefault();
    e.stopPropagation();
    this.state.editModel[field] = e.target.value;
    this.setState({editModel: this.state.editModel});
  }

  goBack = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  render() {
    let childProps = Object.assign({}, this.props);
    delete childProps.children;

    const categoryText = this.state.editModel.rootCategoryIds.map(cateId => this.props.master.definition.categories.find(cate => cate.id === cateId).name).join(', ');

    return (
      <div id="courseDefs-view">
        <div>
          <div className="component-title">
            <h4>{this.state.apiModel.courseDefId ? '編輯課程' : '新增課程'}</h4>
            <div className="component-title-btns">
              {this.state.apiModel.courseDefId ? <button type="button" onClick={this.updateCourseDef}>更新課程</button> : <button type="button" onClick={this.createCourseDef}>建立課程</button>}
              <button type="button" onClick={this.goBack}>取消</button>
            </div>
          </div>
        </div>
        <form className="component-form">
          <fieldset>
            <legend>基本資料</legend>
            <p/> <label className="field">課程編號:</label><input type="text" disabled={true} value={this.state.apiModel.courseDefId || ''} />
            <label className="field">課程審核狀態:</label><input type="text" disabled={true} value={this.state.apiModel.verifyStatus || ''} />
            <p/> <label className="field" htmlFor="name">*課程名稱:</label> <input type="text" value={this.state.editModel.name} onChange={this.changeCourseDef.bind(this, 'name')} />
            <p/> <label className="field">*基本時數:</label>
            <input type="number" id="name" value={this.state.editModel.totalTime.hours} onChange={this.handleTotalTimeHoursChange} /> 小時
            <input type="number" max="60" id="name" value={this.state.editModel.totalTime.mins} onChange={this.handleTotalTimeMinsChange} /> 分
            <p/> <label className="field">*課程定價:</label> <input type="number" value={this.state.editModel.price} onChange={this.changeCourseDef.bind(this, 'price')}/>
            <p/> <label className="field">*課程等級:</label>
            <select value={this.state.editModel.level} onChange={this.changeCourseDef.bind(this, 'level')}>
              <option value="L" >初級</option>
              <option value="M" >中級</option>
              <option value="H" >高級</option>
            </select>
            <p/> <label className="field">*課程屬性:</label>
            <select value="1" onChange={this.handleChangeCourseAttribute}>
              <option value="1" >單一課程</option>
            </select>
            <p/> <label className="field">*課程分類:</label> <textarea value={categoryText} onClick={() => this.setState({ openCourseCatePicker:true})} />

            <p/> <label className="field">*課程圖片:</label>
            <Document 
              auth={this.props.auth} 
              docType="image" 
              convertType="course-image" 
              onUpload={this.handleUploadImage} 
              onFileUrl={this.handleChangeImage.bind(this, 'imageThumbnailPath')}
              displayTag="WebThumbnail"
            />{this.state.editModel.imageFileName}
            {this.state.editModel.imageThumbnailPath !== 'fileKeyIsEmpty' ? <img src={this.state.editModel.imageThumbnailPath}/> : ''}
            <p/> <label className="field">課程簡介影片:</label>
            <Document 
              auth={this.props.auth} 
              docType="video" 
              convertType="course-video" 
              onUpload={this.handleUploadVideo}
              onFileUrl={this.handleChangeImage.bind(this, 'videoThumbnailPath')} 
              displayTag="WebThumbnail"
            />{this.state.editModel.videoFileName}
            {this.state.editModel.videoThumbnailPath !== 'fileKeyIsEmpty' ? <img src={this.state.editModel.videoThumbnailPath}/> : ''}
            <p/> <label className="field">*主辦單位:</label>
            <select value={this.state.editModel.organizationId} onChange={this.changeCourseDef.bind(this, 'organizationId')}>
              {this.props.master.definition.organizations.map(org => <option key={`org_${org.id}`} value={org.id} >{org.name}</option>)}
            </select>
            <p/> <label className="field">*課程簡介:</label> <textarea value={this.state.editModel.brief} onChange={this.changeCourseDef.bind(this, 'brief')} />
            <p/> <label className="field">*課程大綱:</label> <textarea value={this.state.editModel.summaries} onChange={this.changeCourseDef.bind(this, 'summaries')} />
            <p/> <label className="field">*適合對象:</label> <textarea value={this.state.editModel.suitable} onChange={this.changeCourseDef.bind(this, 'suitable')} />
            <p/> <label className="field">課程備註:</label> <textarea value={this.state.editModel.remark} onChange={this.changeCourseDef.bind(this, 'remark')} />
          </fieldset>
          <fieldset>
            <legend>學習完畢的學員應該擁有~</legend>
            <p/> <label className="field">建議職務:</label> <textarea value={this.state.editModel.afterLearn.positions.map(item => item.nameLevel3).join(', ')} onClick={() => this.setState({openPositionPicker:true})} />
            <p/> <label className="field">擁有技能:</label> <textarea value={this.state.editModel.afterLearn.abilities.map(item => item.nameLevel3).join(', ')} onClick={() => this.setState({openAbilityPicker:true})} />
            <p/> <label className="field">擁有專長工具:</label> <textarea value={this.state.editModel.afterLearn.tools.map(item => item.nameLevel3).join(', ')} onClick={() => this.setState({openToolPicker:true})} />
            <p/> <label className="field">擁有證照:</label> <textarea value={this.state.editModel.afterLearn.skills.map(item => item.nameLevel3).join(', ')} onClick={() => this.setState({openSkillPicker:true})} />
          </fieldset>
        </form>
        <ItemPicker title="請選擇課程分類" open={this.state.openCourseCatePicker} items={this.props.master.definition.categories.map(cate => ({...cate, value:cate.id}))} defaultCheckedValues={this.state.editModel.rootCategoryIds} onConfirm={this.onCourseCategoriesPicked} onRequestClose={this.onClosePicker}/>
        <ItemPicker104 title="請選擇職務" open={this.state.openPositionPicker} layerItems={position104} defalutCheckedItems={this.state.editModel.afterLearn.positions} onConfirm={this.onPositionPicked} onRequestClose={this.onClosePicker}/>
        <ItemPicker104 title="請選擇技能" open={this.state.openAbilityPicker} layerItems={ability104} defalutCheckedItems={this.state.editModel.afterLearn.abilities} onConfirm={this.onAbilityPicked} onRequestClose={this.onClosePicker}/>
        <ItemPicker104 title="請選擇工具" open={this.state.openToolPicker} layerItems={tool104} defalutCheckedItems={this.state.editModel.afterLearn.tools} onConfirm={this.onToolsPicked} onRequestClose={this.onClosePicker}/>
        <ItemPicker104 title="請選擇證照" open={this.state.openSkillPicker} layerItems={skill104} defalutCheckedItems={this.state.editModel.afterLearn.skills} onConfirm={this.onSkillPicked} onRequestClose={this.onClosePicker}/>
        {this.props.children && React.cloneElement(this.props.children, childProps)}
      </div>
    );
  }
}