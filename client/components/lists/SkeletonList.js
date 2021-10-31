import Card from "react-bootstrap/Card"
import Form from "react-bootstrap/Form"
import Placeholder from "react-bootstrap/Placeholder"

const SkeletonList = () => {
  return (
    <Card>
      <Card.Header>
        <Placeholder as="h3" animation="glow" />
      </Card.Header>
      <Card.Body>
        {[...Array(10).keys()].map((i) => (
          <Form.Group key={i}>
            <Placeholder xs={6} animation="glow" />
          </Form.Group>
        ))}
      </Card.Body>
    </Card>
  )
}

export default SkeletonList
