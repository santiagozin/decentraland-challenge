export const addThousandSeparators = (value: string) => {
    const [integer, fraction] = value.split(".");
    const withCommas = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return fraction ? `${withCommas}.${fraction}` : withCommas;
  };

  export const formatMiddleEllipsis = (
    value?: string,
    head: number = 7,
    tail: number = 4
  ) => {
    if (!value) return "";
    const str = String(value);
    if (str.length <= head + tail) return str;
    return `${str.slice(0, head)}...${str.slice(-tail)}`;
  };