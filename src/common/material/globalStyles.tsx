import { makeStyles, Theme } from '@material-ui/core/styles';
import theme from './theme';

export const useGlobalStyles = makeStyles((theme: Theme) => ({
  '@global': {
    fontWeight: 'lighter'
  },
  mainContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  headContainer: {
    paddingTop: theme.spacing(8)
  },
  footContainer: {
    paddingBottom: theme.spacing(16)
  }
}));

export const useFormStyles = makeStyles((theme: Theme) => ({
  darkThemeInput: {
    '& label.MuiFormLabel-root': {
      color: 'rgba(255, 255, 255, 0.23)'
    },
    '& label.MuiFormLabel-root.Mui-focused': {
      color: '#FB666B'
    },
    '& label.Mui-focused': {
      color: '#FB666B'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FB666B'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(255, 255, 255, 0.23)'
    },
    '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
      color: '#FFFFFF',
      '&:hover': {
        borderColor: 'rgba(255, 255, 255, 0.23)'
      },
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FB666B'
      }
    }
  },
  lightThemeInput: {
    '& label.MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.23)'
    },
    '& label.MuiFormLabel-root.Mui-focused': {
      color: '#FB666B'
    },
    '& label.Mui-focused': {
      color: '#FB666B'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#FB666B'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'rgba(0, 0, 0, 0.23)'
    },
    '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
      color: '#FFFFFF',
      '&:hover': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      },
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.23)'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FB666B'
      }
    }
  }
}));
