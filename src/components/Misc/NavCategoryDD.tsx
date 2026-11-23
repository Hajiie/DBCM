import { BiChevronDown } from "react-icons/bi";
import { combineClasses } from "../../utils/utils";
import LinkTo from "../LinkTo";
import { categories } from "../../content/model";

interface INavCatergoryDD {
  openDD: boolean;
  setOpenDD: (open: boolean) => void;
  label: string;
  floating?: boolean;
}

const NavCatergoryDD = ({
  openDD,
  setOpenDD,
  label,
  floating = false,
}: INavCatergoryDD) => {
  return (
    <>
      <div className={"relative"}>
        <button
          type="button"
          aria-expanded={openDD}
          className={combineClasses(
            "flex items-center cursor-pointer",
            floating ? "mx-2" : "justify-between"
          )}
          onClick={() => setOpenDD(!openDD)}
        >
          <span>{label}</span>
          <BiChevronDown className="text-[20px]" aria-hidden="true" />
        </button>
        <div
          className={combineClasses(
            openDD ? "overflow-auto" : "hidden",
            floating
              ? "absolute w-[180px] z-20 top-[30px] rounded-[4px] shadow-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-0"
              : "relative",
            openDD ? "h-auto" : "h-0 border-0"
          )}
        >
          <LinkTo href={"/blog"} passHref className="block text-sm py-2 px-2">
            <span onClick={() => setOpenDD(!openDD)}>All Articles</span>
          </LinkTo>
          {categories.map((each) => (
            <LinkTo
              href={"/blog?category=" + each}
              key={each}
              passHref
              className="block text-sm py-2 px-2 border-t border-gray-400"
            >
              <span
                style={{ textTransform: "capitalize" }}
                onClick={() => setOpenDD(!openDD)}
              >
                {each}
              </span>
            </LinkTo>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavCatergoryDD;
