import React from "react";
import styled from "styled-components";

/**
 * 미팅 참여자 목록을 표시하는 컴포넌트
 * @param {Array} availableTimes - 참여자별 가능한 시간 정보
 * @param {Function} onParticipantSelect - 참여자 선택 시 콜백 함수
 */
const ParticipantList = ({ availableTimes, selectedIds, setSelectedIds }) => {
  const toggleParticipantSelection = (currentSelected, userId) => {
    if (currentSelected.includes(userId)) {
      return currentSelected.filter((id) => id !== userId);
    }
    return [...currentSelected, userId];
  };

  const handleParticipantClick = (userId) => {
    setSelectedIds((prev) => toggleParticipantSelection(prev, userId));
    setTimeout(() => {
      console.log(selectedIds);
    }, 500);
  };

  // 참여자가 없는 경우
  if (!availableTimes || availableTimes.length === 0) {
    return (
      <Container>
        <Header>
          <Title>참여자 목록</Title>
          <ParticipantCount>0명</ParticipantCount>
        </Header>
        <EmptyMessage>아직 응답한 참여자가 없습니다.</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>참여자 목록</Title>
        <ParticipantCount>{availableTimes.length}명</ParticipantCount>
      </Header>
      <List>
        {availableTimes.map((participant) => (
          <ListItem
            key={participant.participant_id}
            selected={selectedIds.includes(participant.participant_id)}
            onClick={() => handleParticipantClick(participant.participant_id)}
          >
            <ParticipantInfo>
              <Name>{participant.user_name}</Name>
            </ParticipantInfo>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  margin-top: 1.5rem;
`;

const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const ParticipantCount = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const List = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ListItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  background-color: ${(props) => (props.selected ? "#f3f4f6" : "white")};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.selected ? "#e5e7eb" : "#f9fafb")};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Name = styled.div`
  font-weight: 500;
  color: #111827;
`;

const SelectionCount = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`;

const EmptyMessage = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`;

export default ParticipantList;
