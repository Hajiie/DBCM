import { IAuthor } from "../../shared/interfaces";
import { combineClasses } from "../../utils/utils";
import LinkTo from "../LinkTo";

const Avatar = ({ author, className }: { author: IAuthor, className?: string }) => {
  return (
    <div className={combineClasses(`flex items-center justify-center shadow-xl rounded-full overflow-hidden bg-blue-500 shrink-0`, className)}>
      {author.profilePic ? (
        <img 
          src={author.profilePic} 
          alt={author.name} 
          width="100%" />
      ) : (
        <p className="text-center font-medium text-white">
          {author.name[0]}
        </p>
      )}
    </div>
  );
};

export default Avatar;

export function ArticleAuthorLink({ author }: { author: IAuthor }) {
  return (
    <LinkTo href={"/blog?author=" + encodeURIComponent(author.name)} className="flex items-center text-sm font-medium">
      <Avatar author={author} className="mr-2 h-8 w-8 text-base" />
      {author.name}
    </LinkTo>
  );
}
