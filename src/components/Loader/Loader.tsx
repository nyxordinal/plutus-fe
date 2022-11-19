import { CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

type PropType = {
  isFullHeightScreen: boolean;
};

const Loader = ({ isFullHeightScreen }: PropType) => {
  return (
    <div
      className={`flex justify-center items-center ${
        isFullHeightScreen ? "h-screen" : ""
      } `}
    >
      <CircularProgress />
    </div>
  );
};

Loader.defaultProps = {
  isFullHeightScreen: true,
};

Loader.propTypes = {
  isFullHeightScreen: PropTypes.bool,
};

export default Loader;
