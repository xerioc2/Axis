import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function StudentDropDown() {
  return (
    <Dropdown as={ButtonGroup}>
      <Button variant="success">Split Button</Button>

      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Log Out</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default StudentDropDown;