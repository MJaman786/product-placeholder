interface Prop {
    num:number,
    format:"en-US" | "en-IN"
}

export const formatNumber = ({num, format}:Prop) => {
  return num?.toLocaleString(format); // or "en-US"
};
