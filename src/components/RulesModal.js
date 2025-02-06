import { Modal, Button } from "react-bootstrap";

const ruleItems = [
  "Trò chơi hiển thị một ô chữ với các ô trống tương ứng với số ký tự trong từ/cụm từ bí mật.",
  "Người chơi đoán từng ký tự một.",
  'Người chơi có thể được phần thưởng 100, 200, 300,... đến 1000, hoặc bị 2 hình phạt "Mất điểm" và "Mất lượt".',
  'Khi bị "Mất điểm", người chơi vẫn còn lượt nhưng số điểm về 0.',
  'Khi bị "Mất lượt", người chơi phải nhường lượt chơi cho người chơi kế tiếp.',
  'Nếu đoán đúng, ký tự sẽ hiển thị trong ô chữ và người chơi sẽ được số điểm tương ứng với số lần xuất hiện của ký tự. Ngoại trừ nếu bị "Mất điểm" hoặc "Mất lượt" thì sẽ không được điểm',
  "Nếu đoán sai, sẽ nhường lượt cho người chơi kế tiếp.",
  "Người chơi nào có nhiều điểm nhất sau khi ô chữ đã được đoán xong sẽ THẮNG.",
  "Người chơi có thể chọn chơi lại sau khi kết thúc ván.",
];

const RulesModal = ({ show, handleClose }) => (
  <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Luật Chơi</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ul>
        {ruleItems.map((rule, index) => (
          <li key={index}>{rule}</li>
        ))}
      </ul>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Đóng
      </Button>
    </Modal.Footer>
  </Modal>
);

export default RulesModal;
