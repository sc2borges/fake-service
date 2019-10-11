import { FlowChartWithState } from "@mrblenny/react-flow-chart";
import React from 'react'
import { processData } from './Data'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const NodeInnerCustom = ({ node, children, ...otherProps }) => {
  var className = "node";

  if (node.properties.response !== 200 && node.properties.response !== 0) {
    className = "node-error";
  }

  return (
    <Container {...otherProps} className={className}>
      <Row>
        <Col className="node-header">{node.properties.name}</Col>
      </Row>
      <Row>
        <Col className="node-uri">{node.properties.uri}</Col>
      </Row>
      <Row>
        <Col className="node-key">Duration</Col>
        <Col className="node-value">{node.properties.duration}</Col>
      </Row>
      <Row>
        <Col className="node-key">Type</Col>
        <Col className="node-value">{node.properties.type}</Col>
      </Row>
      <Row>
        <Col className="node-key">Response</Col>
        <Col className="node-value">{node.properties.response}</Col>
      </Row>
    </Container>
  )
}

class Timeline extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      url: this.props.url,
      refresh: this.props.refresh,
      loaded: false,
    };
  }

  componentWillMount() {
    this.fetchData(this.state.url);
  }

  componentWillReceiveProps(props) {
    if (props.refresh !== undefined && props.refresh !== this.state.refresh) {
      console.log("Reload data", props.url, props.refresh);
      this.setState({ url: props.url, loaded: false, refresh: props.refresh });
      this.fetchData(props.url);
    }
  }

  fetchData(url) {
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          console.log("response from API:", result);
          var data = processData(result);

          this.setState({ "data": data, loaded: true });
        },
        (error) => {
          console.error("error processing API", error);
        }
      );
  }

  render() {
    if (this.state.loaded === true) {
      return <FlowChartWithState initialValue={this.state.data} Components={{ NodeInner: NodeInnerCustom }} />
    }

    return null
  }
}

export default Timeline