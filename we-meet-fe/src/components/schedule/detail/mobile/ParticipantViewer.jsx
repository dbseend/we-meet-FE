import React, { useState } from "react";
import styled from "styled-components";
import { parseISOString } from "../../../utils/dateUtils";

/**
 * 참여자 목록과 선택된 시간을 표시하는 컴포넌트
 * @param {Array} availableTimes - 참여자별 가능한 시간 정보
 * @param {Array} timeSlots - 전체 시간 슬롯
 * @param {Array} dates - 전체 날짜
 */
const ParticipantViewer = ({ availableTimes, timeSlots, dates }) => {
  // 선택된 참여자 ID 목록
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  // 참여자 선택/해제 처리
  const handleParticipantClick = (userId) => {
    setSelectedParticipants((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      return [...prev, userId];
    });
  };

  // 선택된 참여자들의 가능 시간 중첩 계산
  const getOverlappingUsers = (date, time) => {
    const filteredUsers = availableTimes.filter((at) => {
      // 참여자가 선택되지 않은 경우 모든 참여자 포함
      if (selectedParticipants.length === 0) return true;
      // 선택된 참여자만 필터링
      if (!selectedParticipants.includes(at.user_id)) return false;

      return at.selected_times.some((datetime) => {
        const { date: atDate, time: atTime } = parseISOString(datetime);
        return atDate === date && atTime === time;
      });
    });

    return filteredUsers.map((user) => ({
      name: user.user_name,
      id: user.user_id,
    }));
  };

  return (
    <Container>
      {/* 참여자 목록 */}
      <ParticipantList>
        <ListHeader>참여자 목록</ListHeader>
        {availableTimes.map((participant) => (
          <ParticipantItem
            key={participant.user_id}
            selected={selectedParticipants.includes(participant.user_id)}
            onClick={() => handleParticipantClick(participant.user_id)}
          >
            <UserName>{participant.user_name}</UserName>
            <SelectionCount>
              선택: {participant.selected_times.length}개
            </SelectionCount>
          </ParticipantItem>
        ))}
      </ParticipantList>
    </Container>
  );
};

// 스타일 컴포넌트
const Container = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1rem;
`;

const ParticipantList = styled.div`
  width: 250px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 1rem;
  background-color: #f9fafb;
  font-weight: 500;
  border-bottom: 1px solid #e5e7eb;
`;

const ParticipantItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#e5e7eb" : "white")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.selected ? "#d1d5db" : "#f3f4f6")};
  }
`;

const UserName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const SelectionCount = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const TimeGrid = styled.div`
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const GridHeader = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(auto-fill, 1fr);
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderCell = styled.div`
  padding: 0.75rem;
  font-weight: 500;
  text-align: center;
  border-right: 1px solid #e5e7eb;
`;

const TimeSlot = styled.div`
  height: 100%;
  background-color: ${(props) => {
    if (props.userCount === 0) return "white";
    if (props.hasSelected) {
      const intensity = Math.min(255, 255 - props.userCount * 50);
      return `rgb(255, ${intensity}, 0)`;
    }
    const intensity = Math.min(255, 255 - props.userCount * 30);
    return `rgb(255, ${intensity}, 0)`;
  }};
  position: relative;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.userCount === 0 ? "#f3f4f6" : null)};
  }
`;

export default ParticipantViewer;
