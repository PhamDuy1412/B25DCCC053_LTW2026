import { PRIZES, MILESTONES } from './data';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const sum = (arr) => arr.reduce((total, x) => total + x, 0);

// Tiền thưởng theo số câu đã trả lời đúng và lý do kết thúc:
// 'win' | 'stop' | 'wrong' | 'timeout'
export const calcPrize = (correctCount, reason) => {
  if (reason === 'win') return PRIZES[PRIZES.length - 1];
  if (reason === 'stop') return correctCount > 0 ? PRIZES[correctCount - 1] : 0;
  // sai hoặc hết giờ: chỉ nhận mốc an toàn cao nhất đã vượt qua
  const passed = MILESTONES.filter((m) => m <= correctCount);
  return passed.length > 0 ? PRIZES[Math.max(...passed) - 1] : 0;
};

// Xáo trộn trên bản sao (Fisher–Yates)
export const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// 50:50 - chọn ngẫu nhiên 2 đáp án sai để ẩn
export const pickTwoWrong = (correctIndex, optionCount = 4) => {
  const wrongs = Array.from({ length: optionCount }, (_, i) => i).filter(
    (i) => i !== correctIndex
  );
  return shuffle(wrongs).slice(0, 2);
};

// Hỏi khán giả: trả về mảng % cho A, B, C, D (tổng = 100)
export const audiencePercents = (correctIndex, hidden, optionCount = 4) => {
  const result = Array(optionCount).fill(0);
  const wrongs = Array.from({ length: optionCount }, (_, i) => i).filter(
    (i) => i !== correctIndex && !hidden.includes(i)
  );
  if (wrongs.length === 0) {
    result[correctIndex] = 100;
    return result;
  }

  let correctPct = 40;
  let shares = [];
  for (let tries = 0; tries < 50; tries++) {
    // chỉ còn 1 đáp án sai thì cho đáp án đúng > 50% để luôn cao nhất
    correctPct = randInt(wrongs.length === 1 ? 51 : 40, 70);
    const rest = 100 - correctPct;
    const weights = wrongs.map(() => randInt(1, 10));
    const total = sum(weights);
    shares = weights.map((w) => Math.floor((rest * w) / total));
    shares[0] += rest - sum(shares);
    if (Math.max(...shares) < correctPct) break;
  }

  result[correctIndex] = correctPct;
  wrongs.forEach((w, k) => {
    result[w] = shares[k];
  });
  return result;
};
