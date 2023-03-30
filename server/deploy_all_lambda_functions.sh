dir="aws/lambda"

for sub_dir in $(ls "$dir"); do
  cd $dir/$sub_dir && bash deploy.sh
  cd ../../..
done
