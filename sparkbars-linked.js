import React, { Component, PropTypes } from 'react';
import d3 from 'd3';
//var _ = require('supergroup');
//var _ = require('../supergroup/dist/supergroup');
//var _ = require('../supergroup/src/supergroup.js');
//import _, {Supergroup} from '../supergroup/src/supergroup';
import _, {Supergroup} from '../supergroup/supergroup';
//import SparkBars from 'sparkbars';
//  TEMPORARY:
import SparkBars from './sparkbars';

/*
 *     TODO: linked by data (current), linked by query (allows multiple
 *            interacting sets)
 */
export default class SparkBarsLinked extends Component {
  constructor() {
    super();
    this.state = {
      subset:{},
    };
  }
  componentWillMount() {
    const {data, dimNames} = this.props;
    let dimData = {};
    dimNames.forEach(dimName=>{
      dimData[dimName] = {
        things: _.supergroup(data, dimName),
      };
      dimData[dimName].selectedThings = dimData[dimName].things;
      this.setState({data, dimData});
    });
  }
  /*
  shouldComponentUpdate(nextProps, nextState) {
    //return this.props.things != nextProps.things || this.props.highlighted != nextProps.highlighted;
  }
  */
  highlight(thing, passthrough, i) {
    const dimName = thing.dim;
    let subset = _.clone(this.state.subset);
    if (subset[dimName] === thing.valueOf())
      return;
    subset[dimName] = thing.valueOf();
    let dimData = _.clone(this.state.dimData);
    let self = this;
    this.props.dimNames.forEach(dn=>
      //dn === dimName ?  dimData[dimName].things :
      dimData[dn].selectedThings = _.supergroup(_.where(self.state.data, subset), dn)
    );
    this.setState({subset, dimData});
  }
  reset(dimName) {
    let subset = _.clone(this.state.subset);
    delete subset[dimName];
    let dimData = _.clone(this.state.dimData);
    let self = this;
    this.props.dimNames.forEach(dn=>
      dimData[dn].selectedThings = _.supergroup(_.where(self.state.data, subset), dn)
    );
    this.setState({subset, dimData});
  }
  render() {
    const {data, dimNames, width, height, orientation} = this.props;
    const {subset, dimData} = this.state;
    let sbs = dimNames.map(dimName=>{
      let all = dimData[dimName].things;
      let selected = dimData[dimName].selectedThings;
      /*
      console.log(dimName, "\n",
         all.map(d=>
          `    ${selectedCnt(d, selected)}/${cnt(d)} ${d.toString()}`)
          .join("\n"));
          */
      return (
        <div key={dimName} style={{
                                    padding: 3,
                                    width:width, margin:8,
                                    border:'1px solid lightgray',
                }}>
          <p style={{fontFamily:'Arial', fontSize:14, fontWeight:'bold',
                    margin: '3px 0px 0px 0px'}}
          >{dimName}
            <a href="#null"
                style={{float:'right', paddingRight:3, }}
                onClick={()=>this.reset.bind(this)(dimName) || false}
            >
            reset
            </a>
          </p>
          <SparkBars
            things={all}
            selected={selected}
            valFunc={d=>selectedCnt(d, selected)}
            //valFunc={d=>-d.records.length}
            sortBy={d=>-d.records.length}
            //passthrough={dim}
            //barNums={barNums}
            width={width}
            height={height} 
            orientation={orientation} 
            barLabel={d=>`${selectedCnt(d, selected)}/${cnt(d)} ${d.toString()}`}
            highlight={this.highlight.bind(this)}
            //endHighlight={this.reset.bind(this)}
            //isHighlighted={this.isHighlighted.bind(this)}
          />
        </div>)
    });
    return (
      <div>
        {JSON.stringify(subset)}
        {sbs}
      </div>
    )
    function cnt(thing) {
      return thing.records.length;
    }
    function selectedCnt(thing, selected) {
      const s = selected && selected.lookup(thing.valueOf());
      if (s)
        return s.records.length;
      return 0;
    }
  }
}
SparkBarsLinked.propTypes = {
  data: PropTypes.array.isRequired, 
  dimNames: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

