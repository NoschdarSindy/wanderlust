import "./byTypeList.css";
import { useImage, useSite } from "src/contexts/WebsiteContext";
import { pluralize } from "src/util";

const ByTypeList = () => {
  const s = useSite();
  const byTypeList = s.typesList;
  const byTypeImages = useImage("homecards/byType") as string[];

  return (
    <div className="pList">
      {byTypeList.map(({ name: type, count }, index) => (
        <div className="pListItem" key={index}>
          <img src={byTypeImages[index]} alt="" className="pListImg" />
          <div className="pListTitles">
            <h1>{type}</h1>
            <h2>{pluralize(count, s.item_name)}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ByTypeList;
