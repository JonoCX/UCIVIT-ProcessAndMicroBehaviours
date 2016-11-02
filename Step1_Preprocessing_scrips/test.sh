timestamp() {
  date +"%T"
}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo $DIR

echo "Loading shell variables" at $(timestamp)


if [ "$mongoUser" = "USERNAME" ] || [ "$mongoUser" = "" ];then 
  echo "anonymous login"
  echo "anonymous login again"
else
  echo "a password is needed"
  echo "a password is needed again"  
fi;