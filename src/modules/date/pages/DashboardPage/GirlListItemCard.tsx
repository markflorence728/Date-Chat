import React, { useEffect, useState } from 'react';
import { Card, createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import { IGirlModel } from '../../../../models/girl.model';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: theme.spacing(2)
    },
    media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
    }
  })
);

export const LoadingUserListItemCard = (props: any) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <Skeleton animation="wave" variant="rect" className={classes.media} />
    </Card>
  );
};

const GirlListItemCard = (props: { girl: IGirlModel; history: any }) => {
  const { girl, history } = props;
  const [photo, setPhoto] = useState('');

  const goDetailPage = () => {
    history.push(`/girl/${girl.uuid}/detail`);
  };

  useEffect(() => {
    setPhoto(girl?.photos && girl?.photos.length > 0 ? girl.photos[girl.photos.length - 1] : '/assets/images/no-photo.png');
  }, [girl]);

  return (
    <div className="w-full shadow mb-4 border border-gray-300">
      <img className="w-full" src={photo} alt={girl.name} onClick={goDetailPage} />
      <div className="flex items-center p-4">
        <p className="flex-1 text-xl">
          {girl.name}, {girl.age}
        </p>
        <p className="text-lg font-light text-gray-600">
          ${girl.rates && girl.rates.length > 0 ? girl.rates[0].rate : 0}
        </p>
      </div>
    </div>
  );
};

export default GirlListItemCard;
