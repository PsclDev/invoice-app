export default function useRandomValue() {
  const Id = () => {
    return (Math.random() + 1).toString(36).substring(7);
  };

  const Number = () => {
    return (Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000).toFixed(2);
  };

  return {
    Id,
    Number,
  };
}
