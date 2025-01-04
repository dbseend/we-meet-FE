// UserMeetings.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUserMeetings } from "../../api/meeting/MeetingAPI";
import { supabase } from "../../lib/supabaseClient";

const MeetingList = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserMeetings = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("로그인이 필요합니다.");
        }

        const response = await getUserMeetings(user.id);

        if (!response.success) {
          throw new Error(response.error);
        }

        setMeetings(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMeetings();
  }, []);

  const handleMoveMeeting = (meeting_id) => {
    navigate(`../meeting/${meeting_id}`);
  };

  if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;
  if (error) return <ErrorMessage>에러: {error}</ErrorMessage>;

  return (
    <Container>
      <Title>내 미팅 목록</Title>
      <MeetingGrid>
        {meetings.map((meeting) => (
          <MeetingCard
            key={meeting.meeting_id}
            onClick={()=>handleMoveMeeting(meeting.meeting_id)}
          >
            <MeetingTitle>{meeting.title}</MeetingTitle>
            <Description>{meeting.description}</Description>
            <DateContainer>
              {meeting.dates.map((date, index) => (
                <DateBadge key={index}>
                  {new Date(date).toLocaleDateString()}
                </DateBadge>
              ))}
            </DateContainer>
            <InfoContainer>
              <p>
                시간: {meeting.time_range_start} - {meeting.time_range_end}
              </p>
              <p>참여자: {meeting.meeting_participants?.length || 0}명</p>
            </InfoContainer>
          </MeetingCard>
        ))}
        {meetings.length === 0 && (
          <EmptyMessage>참여 중인 미팅이 없습니다.</EmptyMessage>
        )}
      </MeetingGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const MeetingGrid = styled.div`
  display: grid;
  gap: 1rem;
`;

const MeetingCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const MeetingTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const DateContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DateBadge = styled.span`
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const InfoContainer = styled.div`
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #6b7280;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
`;

export default MeetingList;
