import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import SparkBars from 'sparkbars';
import SparkBarsLinked from './sparkbars-linked';
//import _, {Supergroup, SGNodeList} from '../supergroup/src/supergroup';
import _, {Supergroup, SGNodeList} from '../supergroup/supergroup';

/*
 "use strict";
var test_data = [
  {"person_id": "0", "domain_id": "Condition", "concept_name": "Acquired trigger finger", "drug_era_start_date": "2008-02-23", "drug_era_end_date": "2008-02-23"},
  {"person_id": "0", "domain_id": "Drug", "concept_name": "Methylprednisolone", "drug_era_start_date": "2008-02-23", "drug_era_end_date": "2008-02-23"},
  {"person_id": "1494", "domain_id": "Condition", "concept_name": "Disorder of lipid metabolism", "drug_era_start_date": "2010-12-01", "drug_era_end_date": "2010-12-01"},
  {"person_id": "1494", "domain_id": "Condition", "concept_name": "Open wound of foot except toes with complication", "drug_era_start_date": "2010-12-01", "drug_era_end_date": "2010-12-01"},
  {"person_id": "1494", "domain_id": "Condition", "concept_name": "Peripheral vascular disease", "drug_era_start_date": "2010-12-01", "drug_era_end_date": "2010-12-01"}];
var domcon = _.supergroup(test_data, ['domain_id','concept_name']);
render(<h4>{domcon[0].leafNodes().map(d=><p key={d+''}>{d.namePath()+''}</p>)}</h4>, document.getElementById('example'));
*/




class Simple extends React.Component {
  render() {
    return (
      <SparkBars
        things={[3,5,2,2,7,9,5,3]}
        //valFunc={d=>d.records.length}
        //sortBy={d=>-d.records.length}
        //passthrough={dim}
        //barNums={barNums}
        width={200}
        height={40} 
        //highlight={this.highlight.bind(this)}
        //endHighlight={this.endHighlight.bind(this)}
        //isHighlighted={this.isHighlighted.bind(this)}
    />)
  }
}
class Linked extends React.Component {
  render() {
    return (
      <SparkBarsLinked 
        data={this.props.data}
        dimNames={this.props.dimNames}
        width={this.props.width}
        height={this.props.height}
        orientation={this.props.orientation}
      />
    );
  }
}

d3.csv('./titanic.csv', function(data) {
  render(
    <div>
      <h3>Simple example</h3>
      <Simple/>
      <h3>Linked example</h3>
      <Linked
        data={data}
        dimNames={['Survived','Sex','Class','Age']}
        width={200}
        height={100}
        orientation='vertical'
      />
    </div>,
    document.getElementById('example')
  );
});

d3.csv('./person_eras.csv', function(data) {
  var domains = _.supergroup(data, 
        ['domain_id','concept_name']);
  let listicles = domains.map(function(domain) {
    var concepts = domain.children.sort((a,b)=>b.records.length-a.records.length).slice(0,20)
    return  <div key={domain.toString()} >
              <h3>{domain.toString()}</h3>
              <SparkBarsLinked 
                  data={_.flatten(_.pluck(concepts, 'records'))}
                  dimNames={['concept_name']}
                  width={500}
                  height={500}
                  orientation={'vertical'}
                />;
            </div>
  });
  render(
    <div>
      {listicles}
    </div>,
    document.getElementById('example2')
  );
});
