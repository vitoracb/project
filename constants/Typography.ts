// Font styles for the application
export const FontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

export const Typography = {
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    lineHeight: 34,
  },
  h3: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    lineHeight: 29,
  },
  h4: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    lineHeight: 24,
  },
  h5: {
    fontFamily: FontFamily.medium,
    fontSize: 18,
    lineHeight: 22,
  },
  h6: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 19,
  },
  subtitle1: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle2: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 21,
  },
  body1: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    lineHeight: 21,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  overline: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    lineHeight: 15,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
};

export default Typography;