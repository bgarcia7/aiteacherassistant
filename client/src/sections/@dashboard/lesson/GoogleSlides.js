import PropTypes from 'prop-types';

ReactGoogleSlides.propTypes = {
  slidesLink: PropTypes.string.isRequired,
  loop: PropTypes.bool,
  slideDuration: PropTypes.number,
  showControls: PropTypes.bool,
  position: PropTypes.number,
  height: PropTypes.string,
  width: PropTypes.string,
  containerStyle: PropTypes.object,
};

/**
 * Generates iframe compatible url to display the presentation
 * @param presentationKey The Google Slides presentation key
 * @param loop Boolean for whether the slides should loop after finishing
 * @param slideDuration Duration in seconds for how long each slide should be
 * @param showControls Boolean for whether to display the Google Slides controls
 */
const constructUrl = (presentationKey, loop, slideDuration, showControls, position) => {
  if (!presentationKey) {
    throw new Error('Failed to fetch presentation key, check the presentation url');
  }

  let baseUrl = 'https://docs.google.com/presentation/d/';
  baseUrl += `${presentationKey}/embed?`;
  baseUrl += `loop=${loop ? 'true' : 'false'}`;

  // If slide duration given, add it
  if (slideDuration) {
    baseUrl += `&start=true`;
    baseUrl += `&delayms=${slideDuration * 1000}`;
  }

  if (!showControls) {
    baseUrl += `&rm=minimal`;
  }

  if (position) {
    baseUrl += `&slide=${position}`;
  }

  return baseUrl;
};

// Regex for extracting presentation id
const regex = new RegExp(
  `(((https|http):\/\/|)docs\.google\.com\/presentation\/d\/)(.+?(?=(\/.+|\/|$)))`
);

// Extracts the slide id from the share-able url
const extractSlidesKey = (slidesUrl) => {
  const match = regex.exec(slidesUrl);
  return match ? match[4] : null;
};

// Calculates dimension for string/numbers
const calcDimension = (dim) => (dim ? (typeof dim === 'number' ? `${dim}px` : dim) : `480px`);

function ReactGoogleSlides({
  slidesLink,
  loop = false,
  slideDuration = null,
  showControls = false,
  position = null,
  width = '640px',
  height = '480px',
  containerStyle = null,
}) {
  const presentationKey = extractSlidesKey(slidesLink);
  const url = constructUrl(presentationKey, loop, slideDuration, showControls, position);

  return (
    <iframe
      src={url}
      width={calcDimension(width)}
      height={calcDimension(height)}
      style={containerStyle ? containerStyle : { border: 0 }}
      allowFullScreen={true}
    />
  );
}

export default ReactGoogleSlides;
