// 기간 계산
export function calculateDuration(startDate, endDate) {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    let durationText = '';

    if (diffDays > 0) {
        durationText += `${diffDays} 일 `;
    }
    if (diffHours > 0) {
        durationText += `${diffHours} 시간 `;
    }
    if (diffMinutes > 0) {
        durationText += `${diffMinutes} 분`;
    }

    return durationText.trim();
}