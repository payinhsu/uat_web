/** provide some common components utility functions */

export generateNumberRangeSelect(startNum, endNum, defaultValue){
  return (
    <select value={defaultValue} onChange={this.handleLayer2Change}>
      {this.state.layer1.level1Content.map((layer2, index) =>
        <option value={layer2.idLevel2} key={`layer2_${index}`}>{layer2.nameLevel2}</option>
      )}
    </select>
  )
}