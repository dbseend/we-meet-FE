const Footer_Desektop = () => {
  const socialLinks = [
    { name: "Twitter", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "GitHub", url: "#" },
  ];

  const copyright = "2025 스케줄러. All rights reserved.";

  return (
    <div className="hidden md:flex md:flex-row justify-between items-center">
      <div>
        <p className="text-gray-600">{copyright}</p>
      </div>
      <div className="flex space-x-6">
        {socialLinks.map(({ name, url }) => (
          <a
            key={name}
            href={url}
            className="text-gray-600 hover:text-gray-900"
          >
            {name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer_Desektop;
